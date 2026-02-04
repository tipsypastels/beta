import { useEffect, useState } from "react";
import type { ServerUser } from "../../types/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons";
import { $connected, $showScroll, $username, wsOn, wsSend } from "./store";
import { useStore } from "@nanostores/react";
import { AnimatePresence, motion } from "motion/react";

export function Crowd() {
  const connected = useStore($connected);
  const showScroll = useStore($showScroll);
  const [users, setUsers] = useState<ServerUser[]>([]);

  useEffect(() => {
    wsOn((message) => {
      if (message.type !== "users") return;
      setUsers(message.users);
    });
  }, []);

  useEffect(() => {
    if (!connected) return;
    const username = localStorage.getItem("beta:username");
    if (username) {
      wsSend({ type: "identify", username, scroll: scrollY });
      $username.set(username);
    }
  }, [connected]);

  return (
    <>
      <AnimatePresence>
        {users.length > 0 && (
          <motion.div
            className="inline-flex items-center rounded-2xl border-2 border-yellow-600 bg-stone-950 p-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              title={`${showScroll ? "Hide" : "Show"} Scroll Positions`}
              className="cursor-pointer"
              onClick={() => $showScroll.set(!showScroll)}
            >
              <FontAwesomeIcon
                icon={showScroll ? faEye : faEyeSlash}
                className="text-yellow-600"
                size="2x"
              />
            </button>
            <div className="ml-2 flex gap-2">
              {users.map((user) => (
                <a
                  href={`#scroll-${user.uuid}`}
                  key={user.uuid}
                  style={{ backgroundColor: user.color }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-yellow-600 text-xl font-bold text-black select-none data-[idle=true]:opacity-50 data-[you=true]:border-2"
                  title={`${user.username ?? "Guest"}${user.you ? " (You)" : ""}`}
                  data-you={user.you}
                  data-idle={
                    !user.you && user.active <= Date.now() - 10 * 60 * 1000
                  }
                >
                  {user.username?.charAt(0).toUpperCase() ?? "?"}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showScroll
        ? users.map((user) =>
            !user.you ? (
              <motion.div
                id={`scroll-${user.uuid}`}
                key={user.uuid}
                className="absolute rounded-r-lg border-2 border-l-0 bg-black p-1 pr-2 text-sm font-bold text-black"
                style={{ color: user.color, borderColor: user.color }}
                initial={{ left: -100, top: user.scroll }}
                animate={{ left: 0, top: user.scroll }}
              >
                @{user.username ?? "Guest"}
              </motion.div>
            ) : null,
          )
        : null}
    </>
  );
}
