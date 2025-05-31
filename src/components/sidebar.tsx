'use client';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const tabs = [
        { id: 'upload', label: 'Upload Dataset' },
        { id: 'training', label: 'Model Training' },
        { id: 'monitor', label: 'Monitor Training' },
        { id: 'export', label: 'Export & Deploy' },
        { id: 'chatbot', label: 'Chatbot Interface' }
    ];

    return (
        <div className="w-64 bg-gray-900 p-4">
            <h2 className="text-xl font-bold text-white mb-6">Navigation</h2>
            <nav className="space-y-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-4 py-2 rounded transition-colors ${activeTab === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
} 