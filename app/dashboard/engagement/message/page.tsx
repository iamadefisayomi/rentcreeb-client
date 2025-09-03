

export default function MessagePage () {
    return (
        <div className="w-full h-full flex-col flex items-center justify-center">
            <img
                src="/quick-chat.svg"
                className="w-full max-w-[90%]"
                alt="No active message"
                draggable={false}
            />
        </div>
    )
}