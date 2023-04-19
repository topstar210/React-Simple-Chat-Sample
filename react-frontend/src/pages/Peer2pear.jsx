import { useEffect, useRef, useState } from "react";

const Peer2peer = ({ socket }) => {
    const msgListElm = useRef();
    const r = (Math.random() + 1).toString(36).substring(7);
    const [myName, setMyName] = useState(r);
    const [myMsg, setMyMsg] = useState("");
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    const clickSendBtn = () => {
        socket.emit('send-message', myMsg, myName);
        setTimeout(() => {
            msgListElm.current.scrollTo(0, (50*messages.length+50));
        }, 200);
        setMyMsg("");
    }
    useEffect(() => {
        socket.emit('join-group', 'You can change later as variable', myName);

        socket.on("current-users", ({ users, messages }) => {
            setMessages(messages);
            setUsers(users);
        })

        socket.on("get-messages", (messages)=> {
            setMessages(messages);
        })

        return () => {
            socket.off('current-users');
            socket.off('get-messages');
        };
    }, [])

    return (
        <div className="px-1">
            <div className="py-5">
                <h1 className="text-center text-xl py-3">Simple WebRTC</h1>
                <div className="text-center text-sm">
                    Ny Name: <span className="font-bold">{myName}</span>
                    <span className="px-5">|</span>
                    Total Users: <span className="font-bold">{users.length}</span>
                </div>
            </div>
            <div className="flex justify-between">
                <div ref={msgListElm} className="w-1/2 h-[calc(100vh-200px)] bg-gray-200 overflow-y-auto">
                    {
                        messages && messages.length > 0 &&
                        messages.map((val, i) =>
                            <div className="p-3" key={i}>
                                <i>{ val.username===myName?"me":val.username }</i>: {val.message}
                            </div>
                        )
                    }
                </div>
                <div className="w-1/2 px-10 flex items-end">
                    <textarea
                        value={myMsg}
                        onChange={e => setMyMsg(e.target.value)}
                        className="w-2/3 border px-1"></textarea>
                    <button
                        onClick={() => clickSendBtn()}
                        className="rounded border bg-blue-400 px-3 mx-3 hover:text-white">send</button>
                </div>
            </div>
        </div>
    )
}

export default Peer2peer;