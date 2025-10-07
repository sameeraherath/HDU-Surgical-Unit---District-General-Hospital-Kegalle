import { useEffect } from "react";
import { useSelector } from "react-redux";
import { initializeSocket, disconnectSocket } from "../services/socketService";

export const useSocket = () => {
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && user) {
      console.log("Initializing Socket.IO...");
      initializeSocket(token);

      return () => {
        console.log("Disconnecting Socket.IO...");
        disconnectSocket();
      };
    }
  }, [token, user]);
};
