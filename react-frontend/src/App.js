import io from 'socket.io-client';
import Peer2peer from "./pages/Peer2pear";

const socket = io(process.env.REACT_APP_SOCKETURL);

function App() {
  return (
    <div className="">
      <Peer2peer socket={socket} />
    </div>
  );
}

export default App;
