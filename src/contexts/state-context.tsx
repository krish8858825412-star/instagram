
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

// Define types for the state
interface Order {
  id: string;
  user: string;
  service: string;
  link: string;
  quantity: number;
  price: number;
  status: 'Pending' | 'Completed' | 'Declined';
  date: string;
}

interface FundRequest {
    id: string;
    user: string;
    amount: number;
    date: string;
    status: 'Pending' | 'Approved' | 'Declined';
    paymentMethod?: string;
    transactionId?: string;
}

interface Wallet {
    userId: string;
    name: string;
    balance: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    date: string;
}

interface HistoryItem {
    action: string;
    target: string;
    user: string;
    date: string;
}

interface Message {
    id: string;
    recipient: string; // 'all' or a specific userId
    subject: string;
    message: string;
    date: string;
}

// Define the shape of the context state
interface GlobalState {
  users: User[];
  orders: Order[];
  wallets: Wallet[];
  wallet: Wallet; // Current user's wallet
  fundRequests: FundRequest[];
  history: HistoryItem[];
  messages: Message[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addFundRequest: (request: FundRequest) => void;
  updateFundRequest: (requestId: string, updates: Partial<FundRequest>) => void;
  addHistoryItem: (item: HistoryItem) => void;
  sendMessageToAll: (subject: string, message: string) => void;
  clearInbox: () => void;
}

// Create the context
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};


// Create a provider component
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth();

  const [users, setUsers] = useLocalStorage<User[]>('app_users', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('app_orders', []);
  const [wallets, setWallets] = useLocalStorage<Wallet[]>('app_wallets', []);
  const [fundRequests, setFundRequests] = useLocalStorage<FundRequest[]>('app_fund_requests', []);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('app_history', []);
  const [messages, setMessages] = useLocalStorage<Message[]>('app_messages', []);

  // Effect to initialize or update user data when authUser changes
  useEffect(() => {
    if (authUser) {
      // Check if user already exists
      const userExists = users.some(u => u.id === authUser.uid);
      if (!userExists) {
        const newUser: User = {
          id: authUser.uid,
          name: authUser.displayName || `User ${authUser.uid.substring(0, 5)}`,
          email: authUser.email || '',
          date: new Date().toISOString(),
        };
        setUsers(prev => [...prev, newUser]);
         addHistoryItem({
          action: 'User Registered',
          target: newUser.id,
          user: 'System',
          date: new Date().toISOString(),
        });
        
        // Add welcome message
        const welcomeMessage: Message = {
            id: `msg-${Date.now()}`,
            recipient: authUser.uid,
            subject: "Welcome to Instagram!",
            message: `Hi ${newUser.name}, welcome aboard! We're thrilled to have you. You can start by exploring our services or adding funds to your wallet.`,
            date: new Date().toISOString(),
        };
        setMessages(prev => [...prev, welcomeMessage]);
      }

      // Check if wallet already exists
      const walletExists = wallets.some(w => w.userId === authUser.uid);
      if (!walletExists) {
        const newWallet: Wallet = {
          userId: authUser.uid,
          name: authUser.displayName || `User ${authUser.uid.substring(0, 5)}`,
          balance: 0, // Start with 0 balance
        };
        setWallets(prev => [...prev, newWallet]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
    // No balance deduction here, only on approval
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    let targetUsername = '';
    
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, ...updates };
        targetUsername = updatedOrder.user;
        // If order is completed, deduct from wallet
        if (updates.status === 'Completed' && order.status !== 'Completed') {
            updateWalletBalance(updatedOrder.price * -1, targetUsername);
        }
        return updatedOrder;
      }
      return order;
    }));
  };
  
  const addFundRequest = (request: FundRequest) => {
      setFundRequests(prev => [...prev, request]);
  };

  const updateFundRequest = (requestId: string, updates: Partial<FundRequest>) => {
    let targetUsername = '';
      setFundRequests(prev => prev.map(req => {
          if (req.id === requestId) {
              const updatedReq = { ...req, ...updates };
              targetUsername = updatedReq.user;
              // If request is approved, add to wallet
              if (updates.status === 'Approved' && req.status !== 'Approved') {
                  updateWalletBalance(updatedReq.amount, targetUsername);
              }
              return updatedReq;
          }
          return req;
      }))
  }

  const addHistoryItem = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev]);
  }

  const updateWalletBalance = (amount: number, username: string) => {
      const targetUser = users.find(u => u.name === username);
      if (!targetUser) return;
      
      setWallets(prev => prev.map(w => 
        w.userId === targetUser.id ? { ...w, balance: w.balance + amount } : w
      ));
  }
  
  const sendMessageToAll = (subject: string, message: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      recipient: 'all',
      subject,
      message,
      date: new Date().toISOString(),
    };
    setMessages(prev => [newMessage, ...prev]);
    addHistoryItem({
        action: 'Sent Global Message',
        target: 'All Users',
        user: 'Admin',
        date: new Date().toISOString()
    })
  }

  const clearInbox = () => {
    if (!authUser) return;
    setMessages(prev => prev.filter(m => m.recipient !== authUser.uid && m.recipient !== 'all'));
    addHistoryItem({
        action: 'Cleared Inbox',
        target: authUser.uid,
        user: authUser.displayName || 'User',
        date: new Date().toISOString(),
    });
  }

  const currentUserWallet = wallets.find(w => w.userId === authUser?.uid) || { userId: '', name: '', balance: 0 };
  
  const userMessages = messages.filter(m => m.recipient === 'all' || m.recipient === authUser?.uid);

  const value = {
    users,
    orders,
    wallets,
    wallet: currentUserWallet,
    fundRequests,
    history,
    messages: userMessages,
    addOrder,
    updateOrder,
    addFundRequest,
    updateFundRequest,
    addHistoryItem,
    sendMessageToAll,
    clearInbox,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Create a custom hook to use the context
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
