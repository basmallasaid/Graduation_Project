// src/contexts/SignalRContext.js
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import * as signalR from "@microsoft/signalr";

const SignalRContext = createContext(null);

export const useSignalR = () => {
    const context = useContext(SignalRContext);
    if (!context) {
        throw new Error("useSignalR must be used within a SignalRProvider");
    }
    return context;
};

export const SignalRProvider = ({ children }) => {
    const [connection, setConnection] = useState(null); // The HubConnection object
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef(null); // To hold the actual HubConnection object across renders

    const startConnection = useCallback(async (token) => {
        if (!token) {
            console.log("SignalRProvider: No token provided, cannot start connection.");
            return null;
        }

        if (connectionRef.current &&
            (connectionRef.current.state === signalR.HubConnectionState.Connected ||
             connectionRef.current.state === signalR.HubConnectionState.Connecting)) {
            console.log("SignalRProvider: Connection already exists or is connecting. Current state:", connectionRef.current.state);
            setConnection(connectionRef.current); // Ensure context state is updated
            setIsConnected(connectionRef.current.state === signalR.HubConnectionState.Connected);
            return connectionRef.current;
        }

        console.log("SignalRProvider: Attempting to start new connection...");
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://cityroots.runasp.net/chathub", {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information) // Or LogLevel.Debug for more details
            .build();

        newConnection.onreconnecting(error => {
            console.warn(`SignalRProvider: Connection lost due to error "${error}". Reconnecting...`);
            setIsConnected(false);
        });

        newConnection.onreconnected(connectionId => {
            console.log(`SignalRProvider: Connection reestablished. Connected with connectionId "${connectionId}".`);
            setIsConnected(true);
            setConnection(newConnection); // Update context state
        });

        newConnection.onclose(error => {
            console.log(`SignalRProvider: Connection closed. Error: ${error || "No error details"}`);
            setIsConnected(false);
            // Don't nullify connectionRef.current here if withAutomaticReconnect is active
            // Only nullify if it's a deliberate stop.
        });

        try {
            await newConnection.start();
            console.log("SignalRProvider: Connected successfully. Connection ID:", newConnection.connectionId);
            connectionRef.current = newConnection;
            setConnection(newConnection);
            setIsConnected(true);
            return newConnection;
        } catch (err) {
            console.error("SignalRProvider: Connection failed to start:", err);
            connectionRef.current = null;
            setConnection(null);
            setIsConnected(false);
            return null;
        }
    }, []); // Empty dependency array as it doesn't depend on component props/state

    const stopConnection = useCallback(async () => {
        if (connectionRef.current) {
            console.log("SignalRProvider: Attempting to stop connection. Current state:", connectionRef.current.state);
            try {
                // Remove all handlers before stopping, especially if they are general
                // connectionRef.current.off("SomeGeneralEvent");
                await connectionRef.current.stop();
                console.log("SignalRProvider: Connection stopped successfully.");
            } catch (err) {
                console.error("SignalRProvider: Failed to stop connection gracefully:", err);
            } finally {
                connectionRef.current = null;
                setConnection(null);
                setIsConnected(false);
            }
        } else {
            console.log("SignalRProvider: No active connection to stop.");
        }
    }, []); // Empty dependency array

    const value = {
        connection,       // The HubConnection object for components to use
        isConnected,
        startConnection,
        stopConnection,
    };

    return (
        <SignalRContext.Provider value={value}>
            {children}
        </SignalRContext.Provider>
    );
};