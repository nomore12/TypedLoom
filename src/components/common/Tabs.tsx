interface TabsProps<T extends string> {
  tabs: { value: T; label: string }[];
  activeTab: T;
  onTabChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabsProps<T>) {
  return (
    <div
      className={`flex h-10 items-center border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`h-full px-4 text-sm font-medium transition-colors ${
            activeTab === tab.value
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
