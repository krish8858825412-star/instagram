
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

// Define types for the state
interface Order {
  id: string;
  user: string;
  userId: string;
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
    userId: string;
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
    user: string; // Can be user name or user id
    date: string;
}

interface Message {
    id: string;
    recipient: string; // 'all' or a specific userId
    subject: string;
    message: string;
    date: string;
}

interface ServiceLimits {
  followers: number;
  likes: number;
  comments: number;
  views: number;
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
  qrCodeUrl: string;
  serviceLimits: ServiceLimits;
  getUserData: (userId: string) => { user: User | undefined; wallet: Wallet | undefined; userOrders: Order[]; userFundRequests: FundRequest[]; userHistory: HistoryItem[] };
  getTodaysOrderCount: (service: string) => number;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addFundRequest: (request: FundRequest) => void;
  updateFundRequest: (requestId: string, updates: Partial<FundRequest>, approvedAmount?: number) => void;
  addHistoryItem: (item: HistoryItem) => void;
  sendMessageToAll: (subject: string, message: string) => void;
  clearInbox: () => void;
  setQrCodeUrl: (url: string) => void;
  setServiceLimits: (limits: ServiceLimits) => void;
}

// Create the context
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

// Create a provider component
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth();

  // NOTE: We are replacing localStorage with component state as a first step.
  // The next step will be to connect this to Firebase.
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [fundRequests, setFundRequests] = useState<FundRequest[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('https://i.ibb.co/QvH6T1Yb/IMG-20251210-165618.jpg');
  const [serviceLimits, setServiceLimits] = useState<ServiceLimits>({
    followers: 1000,
    likes: 1000,
    comments: 1000,
    views: 1000,
  });

  // Effect to initialize or update user data when authUser changes
  useEffect(() => {
    if (authUser) {
      setUsers(prevUsers => {
        const userExists = prevUsers.some(u => u.id === authUser.uid);
        if (!userExists) {
          const newUser: User = {
            id: authUser.uid,
            name: authUser.displayName || `User ${authUser.uid.substring(0, 5)}`,
            email: authUser.email || '',
            date: new Date().toISOString(),
          };
          addHistoryItem({
            action: 'User Registered',
            target: newUser.id,
            user: newUser.name,
            date: new Date().toISOString(),
          });
          setMessages(prev => [...prev, {
              id: `msg-${Date.now()}`,
              recipient: authUser.uid,
              subject: "Welcome to Instagram!",
              message: `Hi ${newUser.name}, welcome aboard! We're thrilled to have you. You can start by exploring our services or adding funds to your wallet.`,
              date: new Date().toISOString(),
          }]);
          return [...prevUsers, newUser];
        }
        return prevUsers;
      });

      setWallets(prevWallets => {
        const walletExists = prevWallets.some(w => w.userId === authUser.uid);
        if (!walletExists) {
          const newWallet: Wallet = {
            userId: authUser.uid,
            name: authUser.displayName || `User ${authUser.uid.substring(0, 5)}`,
            balance: 0, // Start with 0 balance
          };
          return [...prevWallets, newWallet];
        }
        return prevWallets;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const addOrder = (order: Order) => {
    // Deduct price from wallet immediately on order creation
    setWallets(prevWallets => prevWallets.map(w => 
        w.userId === order.userId ? { ...w, balance: w.balance - order.price } : w
    ));
    setOrders(prev => [order, ...prev]);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    const originalOrder = orders.find(o => o.id === orderId);
    if (!originalOrder) return;

    // If order is being declined, and was not previously declined, refund the user
    if (updates.status === 'Declined' && originalOrder.status !== 'Declined') {
        setWallets(prevWallets => prevWallets.map(w =>
           w.userId === originalOrder.userId ? { ...w, balance: w.balance + originalOrder.price } : w
        ));
    }
    
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
  };
  
  const addFundRequest = (request: FundRequest) => {
      setFundRequests(prev => [request, ...prev]);
  };

  const updateFundRequest = (requestId: string, updates: Partial<FundRequest>, approvedAmount?: number) => {
    const originalRequest = fundRequests.find(req => req.id === requestId);
    if (!originalRequest) return;
  
    // Only process wallet change if status is changing to "Approved"
    if (updates.status === 'Approved' && originalRequest.status !== 'Approved') {
      const amountToAdd = approvedAmount !== undefined ? approvedAmount : originalRequest.amount;
      if (amountToAdd > 0) {
        setWallets(prevWallets =>
          prevWallets.map(w =>
            w.userId === originalRequest.userId ? { ...w, balance: w.balance + amountToAdd } : w
          )
        );
      }
    }
  
    // Update the request in the state
    setFundRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, ...updates, amount: approvedAmount !== undefined ? approvedAmount : req.amount } : req
    ));
  };

  const addHistoryItem = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev]);
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
  
  const getTodaysOrderCount = (service: string) => {
    if(!service) return 0;
    const today = new Date().toISOString().split('T')[0];
    return orders.filter(o => o.service.toLowerCase() === service.toLowerCase() && o.date.startsWith(today)).length;
  }
  
  const getUserData = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const wallet = wallets.find(w => w.userId === userId);
    const userOrders = orders.filter(o => o.userId === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const userFundRequests = fundRequests.filter(fr => fr.userId === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const userHistory = history.filter(h => h.user === user?.name || h.user === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { user, wallet, userOrders, userFundRequests, userHistory };
  };

  const currentUserWallet = wallets.find(w => w.userId === authUser?.uid) || { userId: '', name: '', balance: 0 };
  
  const userMessages = authUser ? messages.filter(m => m.recipient === 'all' || m.recipient === authUser?.uid) : [];

  const value = {
    users,
    orders,
    wallets,
    wallet: currentUserWallet,
    fundRequests,
    history,
    messages: userMessages,
    qrCodeUrl,
    serviceLimits,
    getUserData,
    getTodaysOrderCount,
    addOrder,
    updateOrder,
    addFundRequest,
    updateFundRequest,
    addHistoryItem,
    sendMessageToAll,
    clearInbox,
    setQrCodeUrl,
    setServiceLimits,
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
