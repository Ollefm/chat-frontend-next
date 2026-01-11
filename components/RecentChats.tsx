import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export function RecentChatsForDashboard() {
  const { user } = useAuthStore();
  const chats = useChatStore((state) => state.chats);
  return (
    <div className="w-full">
      <h2 className="text-xl font-medium">Recent Chats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
        {chats.length === 0 ? (
          <h3 className="text-stone-500">No chats yet</h3>
        ) : (
          chats.map((item) => {
            const otherUsername =
              item.username1 !== user?.username
                ? item.username1
                : item.username2;
            return (
              <button
                key={item.id}
                onClick={() => console.log(`Clicked ${otherUsername}`)}
                className="flex flex-col p-4 text-left border border-stone-200 rounded-2xl transition-all cursor-pointer duration-200 group"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full transition-colors bg-gray-100 dark:bg-stone-600">
                    <span className="text-xs font-bold">
                      {otherUsername.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold">{otherUsername}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export function RecentChatsForSidebar({
  minified,
}: Readonly<{ minified: boolean }>) {
  const { user } = useAuthStore();
  const chats = useChatStore((state) => state.chats);

  return (
    <div>
      {chats.map((chat) => {
        const otherUsername =
          chat.username1 !== user?.username ? chat.username1 : chat.username2;
        const initial = otherUsername.charAt(0).toUpperCase();
        const active = false;
        // const badge = chat.hasUnreadMessages;

        return (
          <Link
            key={chat.id}
            href={`/${chat.id}`}
            className={`
              group flex items-center rounded-lg py-2.5 px-3 transition-all duration-200
              ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-stone-300 dark:hover:bg-stone-800"
              }
              ${minified ? "justify-center" : "gap-3"}
            `}
            title={minified ? otherUsername : undefined}
          >
            <div
              className={`
              flex items-center justify-center w-8 h-8 rounded-full transition-colors
              ${
                active
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700 dark:bg-stone-700 dark:text-stone-300 dark:group-hover:bg-stone-600"
              }
            `}
            >
              <span className="text-xs font-bold">{initial}</span>
            </div>

            {!minified && (
              <div className="flex items-center justify-between flex-1 overflow-hidden">
                <span className="truncate text-sm font-medium dark:text-stone-200">
                  {otherUsername}
                </span>
                {true && (
                  <span
                    className="h-2 w-2 rounded-full bg-red-500 "
                    aria-label="New messages"
                  ></span>
                )}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
