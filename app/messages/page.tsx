export const dynamic = 'force-dynamic';

export default function MessagePage () {
    return (
        <div className="w-full h-full bg-slate-50 flex-col px-4 flex items-center justify-center">
            <img
                src="/quick-chat.svg"
                className="w-full max-w-[70%]"
                alt="No active message"
                draggable={false}
            />
        </div>
    )
}