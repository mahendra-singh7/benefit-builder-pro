/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  LayoutDashboard, 
  Gamepad2, 
  Settings, 
  Activity,
  ShieldCheck,
  Plus,
  Trash2,
  TrendingUp, 
  DollarSign, 
  Heart,
  Users,
  Timer,
  CheckCircle2,
  AlertCircle,
  Menu,
  ChevronRight,
  Monitor,
  LogIn
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc,
  serverTimestamp, 
  orderBy, 
  getDoc,
  onSnapshot as onSnapshotSub
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, loginWithGoogle } from './lib/firebase';
import { Benefit, EventConfig } from './types';

// Components
const Navbar = ({ view, setView, user, isAdmin, onLogin }: { view: string, setView: (v: string) => void, user: User | null, isAdmin: boolean | null, onLogin: () => void }) => (
  <nav className="fixed top-0 left-0 w-full h-16 border-b border-[#2A2A2A] bg-[#0A0A0A]/80 backdrop-blur-md z-50 px-4 md:px-6 flex items-center justify-between">
    <div className="flex flex-col">
      <div className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-[#888] mb-0.5 font-mono">System v1.2.4 // Command Center</div>
      <div className="flex items-center gap-2">
        <span className="font-light tracking-tight text-lg md:text-xl text-white">BENEFIT <span className="hidden sm:inline">BUILDER</span> <span className="text-[#00FF41] font-mono font-bold">PRO</span></span>
      </div>
    </div>
    <div className="flex items-center gap-2 md:gap-6">
      <div className="flex items-center gap-1 md:gap-2">
        {(user === null || isAdmin === true || view === 'admin') && (
          <button 
            onClick={() => setView('admin')}
            className={`tab-button px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-xs transition-all ${view === 'admin' ? 'active text-[#00FF41]' : 'text-[#888] hover:text-white'}`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 inline md:mr-2" /> <span className="hidden sm:inline">Admin</span>
          </button>
        )}
        <button 
          onClick={() => setView('player')}
          className={`tab-button px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-xs transition-all ${view === 'player' ? 'active text-[#00FF41]' : 'text-[#888] hover:text-white'}`}
        >
          <Gamepad2 className="w-3.5 h-3.5 inline md:mr-2" /> <span className="hidden sm:inline">Player</span>
        </button>
      </div>

      {user && (
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-6 border-l border-[#222]">
          <div className="text-right hidden lg:block">
            <div className="text-[10px] text-white font-bold uppercase truncate max-w-[100px]">{user.displayName}</div>
            <div className="text-[8px] text-[#00FF41] font-mono uppercase">Authorized</div>
          </div>
          {user.photoURL && <img src={user.photoURL} className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-[#333]" referrerPolicy="no-referrer" />}
        </div>
      )}
    </div>
  </nav>
);

// Admin Components
const CreateEventModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState(2500);
  const [timer, setTimer] = useState(600);

  const handleSubmit = async () => {
    if (!name) {
      alert('Please enter an event name');
      return;
    }
    // Generate a 6-character alphanumeric ID
    const eventId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newEvent = {
      id: eventId,
      name,
      budget,
      timer,
      status: 'waiting',
      createdAt: serverTimestamp()
    };
    try {
      await setDoc(doc(db, 'events', eventId), newEvent);
      setName(''); // Reset for next use
      onClose();
    } catch (e) {
      console.error("Failed to create event", e);
      alert('Critical Error: Failed to initialize remote session. Check cloud connectivity.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="sophisticated-panel p-8 w-full max-w-md border-[#333]">
        <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-2">
          Setup Live Event <span className="text-[#00FF41] font-mono text-sm font-bold">CONFIG</span>
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] ml-1">Event Name</label>
            <input value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-4 py-3 mt-1 outline-none focus:border-[#00FF41] transition-all font-mono text-sm" placeholder="BT-9942 SESSION" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] ml-1">Budget</label>
              <input value={budget} onChange={e => setBudget(Number(e.target.value))} type="number" className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-4 py-3 mt-1 outline-none focus:border-[#00FF41] transition-all font-mono text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] ml-1">Timer (SEC)</label>
              <input value={timer} onChange={e => setTimer(Number(e.target.value))} type="number" className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-4 py-3 mt-1 outline-none focus:border-[#00FF41] transition-all font-mono text-sm" />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={onClose} className="flex-1 py-3 text-[10px] font-bold tracking-widest bg-transparent border border-[#333] hover:border-[#888] transition-all uppercase">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 py-3 text-[10px] font-bold tracking-widest bg-[#00FF41] text-black hover:brightness-110 transition-all uppercase rounded-sm shadow-[0_0_20px_rgba(0,255,65,0.2)]">Initialize</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [events, setEvents] = useState<EventConfig[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventConfig | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [adminTab, setAdminTab] = useState<'system' | 'history'>('system');

  const [isAddingBenefit, setIsAddingBenefit] = useState(false);
  const [newBenefit, setNewBenefit] = useState({ name: '', cost: 0, happiness: 0, category: 'Lifestyle' });

  const handleAddBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    await setDoc(doc(db, 'benefits', id), { ...newBenefit, id, size: 1 });
    setNewBenefit({ name: '', cost: 0, happiness: 0, category: 'Lifestyle' });
    setIsAddingBenefit(false);
  };

  const handleDeleteBenefit = async (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      await deleteDoc(doc(db, 'benefits', id));
    }
  };

  useEffect(() => {
    // Real-time benefits
    const unsubBenefits = onSnapshot(collection(db, 'benefits'), (snap) => {
      const data = snap.docs.map(doc => doc.data() as Benefit);
      setBenefits(data);
      
      const defaultBenefits = [
        { id: '1', name: 'Premium Health', category: 'Health', cost: 800, happiness: 95, size: 2 },
        { id: '2', name: 'Standard Health', category: 'Health', cost: 400, happiness: 60, size: 1 },
        { id: '3', name: 'Unlimited PTO', category: 'Lifestyle', cost: 100, happiness: 100, size: 2 },
        { id: '4', name: '401k Match 5%', category: 'Finance', cost: 300, happiness: 75, size: 2 },
        { id: '5', name: 'Flexible Working Hours', category: 'Lifestyle', cost: 100, happiness: 70, size: 1 },
        { id: '6', name: 'Professional Development', category: 'Growth', cost: 500, happiness: 85, size: 2 },
        { id: '7', name: 'Mental Health Support', category: 'Health', cost: 200, happiness: 90, size: 1 },
        { id: '8', name: 'Gym Membership', category: 'Health', cost: 150, happiness: 50, size: 1 },
        { id: '9', name: 'Remote Work Stipend', category: 'Lifestyle', cost: 300, happiness: 85, size: 2 },
        { id: '10', name: 'Life Insurance', category: 'Security', cost: 250, happiness: 45, size: 1 },
        { id: '11', name: 'Dental & Vision', category: 'Health', cost: 350, happiness: 80, size: 1 },
        { id: '12', name: 'Pet Insurance', category: 'Lifestyle', cost: 200, happiness: 65, size: 1 },
        { id: '13', name: 'Daily Lunch Voucher', category: 'Food', cost: 600, happiness: 95, size: 2 },
        { id: '14', name: 'Commuter Benefits', category: 'Finance', cost: 200, happiness: 45, size: 1 },
        { id: '15', name: 'Parental Leave Bonus', category: 'Family', cost: 400, happiness: 90, size: 2 },
        { id: '16', name: 'On-site Childcare', category: 'Family', cost: 1200, happiness: 100, size: 3 },
        { id: '17', name: 'Stocks/RSUs Package', category: 'Finance', cost: 1500, happiness: 95, size: 3 },
        { id: '18', name: 'Wellness Retreat', category: 'Growth', cost: 1000, happiness: 90, size: 2 },
        { id: '19', name: 'Ergonomic Equipment', category: 'Growth', cost: 450, happiness: 75, size: 2 },
        { id: '20', name: 'Tuition Assistance', category: 'Growth', cost: 700, happiness: 85, size: 2 },
        { id: '21', name: 'Unlimited Snacks', category: 'Food', cost: 150, happiness: 60, size: 1 },
        { id: '22', name: 'Company Car Pass', category: 'Finance', cost: 550, happiness: 70, size: 2 },
        { id: '23', name: 'Volunteer Days', category: 'Lifestyle', cost: 100, happiness: 80, size: 1 },
        { id: '24', name: 'Relocation Help', category: 'Security', cost: 900, happiness: 75, size: 2 },
      ];

      // Only add benefits that don't exist yet
      if (data.length < defaultBenefits.length) {
        defaultBenefits.forEach(b => {
          if (!data.find(existing => existing.id === b.id)) {
            setDoc(doc(db, 'benefits', b.id), b);
          }
        });
      }
    });

    // Real-time events
    const unsubEvents = onSnapshot(query(collection(db, 'events'), orderBy('createdAt', 'desc')), (snap) => {
      setEvents(snap.docs.map(doc => doc.data({ serverTimestamps: 'estimate' }) as EventConfig));
    });

    return () => {
      unsubBenefits();
      unsubEvents();
    };
  }, []);

  useEffect(() => {
    if (!selectedEvent) {
      setSubmissions([]);
      return;
    }
    const unsubSub = onSnapshot(collection(db, 'events', selectedEvent.id, 'submissions'), (snap) => {
      setSubmissions(snap.docs.map(doc => doc.data()));
    });
    return () => unsubSub();
  }, [selectedEvent?.id]);

  return (
    <div className="pt-24 px-4 md:px-8 pb-12 max-w-7xl mx-auto grid grid-cols-12 gap-6 md:gap-8">
      <CreateEventModal isOpen={showModal} onClose={() => setShowModal(false)} />
      
      {/* Sidebar / Stats */}
      <div className="col-span-12 lg:col-span-3 space-y-4 md:space-y-6 order-2 lg:order-1">
        <div className="sophisticated-panel p-6 border-[#2A2A2A] bg-[#111]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold font-mono">Status // Live</span>
            <div className={`status-dot animate-pulse ${selectedEvent ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-[#00FF41] shadow-[0_0_8px_rgba(0,255,65,0.6)]'}`} />
          </div>
          <div className="text-3xl font-light text-white tracking-tight">{selectedEvent ? 'ACTIVE' : 'STANDBY'}</div>
          <div className="text-[10px] text-[#666] mt-2 uppercase font-mono">{selectedEvent ? selectedEvent.name : 'Ready for instruction'}</div>
        </div>
        
        <div className="sophisticated-panel p-6 bg-[#111] space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Total Assets</span>
            <span className="text-lg font-mono text-white">{benefits.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Active Sessions</span>
            <span className="text-lg font-mono text-white">{events.filter(e => e.status !== 'finished').length}</span>
          </div>
        </div>

        {selectedEvent && (
          <div className="sophisticated-panel p-6 bg-[#111]">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-4">Remote Operations</h4>
            <div className="grid grid-cols-1 gap-2">
              {selectedEvent.status !== 'finished' && (
                <button 
                  onClick={async () => {
                    if(confirm('Finalize this session?')) {
                      await setDoc(doc(db, 'events', selectedEvent.id), { status: 'finished' }, { merge: true });
                      setSelectedEvent(null);
                    }
                  }}
                  className="w-full py-2 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#00FF41]/20 transition-all mb-2"
                >
                  Finalize Session
                </button>
              )}
              <button 
                onClick={() => setSelectedEvent(null)}
                className="w-full py-2 bg-[#1A1A1A] border border-[#333] text-[#888] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:border-[#444] transition-all"
              >
                Close Monitor
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="col-span-12 lg:col-span-9 space-y-8 order-1 lg:order-2">
        <section>
          <div className="flex items-center justify-between mb-6 border-b border-[#222] pb-4">
            <div className="flex items-center gap-8">
              <h2 className="text-xl font-light text-white flex items-center gap-3">
                <span className="text-[#00FF41] font-mono uppercase text-sm font-bold">[01]</span> 
                {adminTab === 'system' ? 'LIVE EVENTS' : 'SESSION HISTORY'}
              </h2>
              <div className="flex bg-[#111] p-1 rounded-sm border border-[#222]">
                <button 
                  onClick={() => { setAdminTab('system'); setSelectedEvent(null); }}
                  className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${adminTab === 'system' ? 'bg-[#00FF41] text-black' : 'text-[#666] hover:text-white'}`}
                >
                  System
                </button>
                <button 
                  onClick={() => { setAdminTab('history'); setSelectedEvent(null); }}
                  className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${adminTab === 'history' ? 'bg-[#00FF41] text-black' : 'text-[#666] hover:text-white'}`}
                >
                  History
                </button>
              </div>
            </div>
            {adminTab === 'system' && (
              <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#1A1A1A] border border-[#333] hover:border-[#00FF41] transition-colors text-[10px] uppercase font-bold tracking-widest text-white rounded-sm flex items-center gap-2">
                <Plus className="w-3 h-3" /> Create New Session
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter(e => adminTab === 'system' ? e.status !== 'finished' : e.status === 'finished').map(event => (
              <div 
                key={event.id} 
                onClick={() => setSelectedEvent(event)}
                className={`sophisticated-panel p-6 border-[#222] hover:border-[#444] transition-all cursor-pointer group ${selectedEvent?.id === event.id ? 'border-[#00FF41] bg-[#0A0A0A]' : 'bg-[#111]'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-light text-lg text-white tabular-nums tracking-tight">{event.name}</h3>
                    <div className="flex flex-wrap gap-2 text-[10px] text-[#00FF41] mt-1 uppercase font-mono tracking-widest font-bold items-center">
                        ID: {event.id}
                        <div className="flex gap-2">
                          {event.status !== 'finished' ? (
                            <>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const joinLink = `${window.location.origin}?session=${event.id}`;
                                  navigator.clipboard.writeText(joinLink);
                                  alert('Invite link copied!');
                                }}
                                className="px-2 py-0.5 border border-[#00FF41]/30 hover:bg-[#00FF41]/20 transition-all text-[8px]"
                              >
                                INVITE
                              </button>
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if(confirm('Mark this session as COMPLETE? It will be moved to History.')) {
                                    try {
                                      await setDoc(doc(db, 'events', event.id), { status: 'finished' }, { merge: true });
                                      if(selectedEvent?.id === event.id) setSelectedEvent(null);
                                    } catch (err) {
                                      alert('System error: Failed to complete session.');
                                    }
                                  }
                                }}
                                className="px-2 py-0.5 border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/20 transition-all text-[8px]"
                              >
                                COMPLETE
                              </button>
                            </>
                          ) : null}
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              if(confirm('Permanently PURGE this session and all data?')) {
                                try {
                                  await deleteDoc(doc(db, 'events', event.id));
                                  if(selectedEvent?.id === event.id) setSelectedEvent(null);
                                } catch (err) {
                                  alert('System error: Failed to purge session.');
                                }
                              }
                            }}
                            className="px-2 py-0.5 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all text-[8px]"
                          >
                            PURGE
                          </button>
                        </div>
                    </div>
                    <div className="flex gap-3 text-[10px] text-[#666] mt-1 uppercase font-mono tracking-widest">
                      <span>${event.budget} BU</span>
                      <span>/</span>
                      <span>{Math.floor(event.timer/60)}M TMR</span>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest border ${event.status === 'waiting' ? 'border-blue-900/50 text-blue-400' : 'border-[#00FF41]/50 text-[#00FF41]'}`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex -space-x-1">
                    {[1,2,3].map(i => <div key={i} className="w-7 h-7 bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[10px] font-mono text-[#888]">ID_{i}</div>)}
                    <div className="w-7 h-7 bg-[#0A0A0A] border border-[#222] border-dashed flex items-center justify-center text-[10px] text-[#444]">+2</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#444] group-hover:text-[#00FF41] transition-all group-hover:translate-x-1" />
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="col-span-2 sophisticated-panel p-16 flex flex-col items-center justify-center text-center bg-[#111] border-dashed border-[#222]">
                <BarChart3 className="w-10 h-10 text-[#222] mb-4" />
                <p className="text-[#444] text-[10px] uppercase font-bold tracking-[0.3em]">System Standby // Awaiting Instructions</p>
              </div>
            )}
          </div>
        </section>

        {selectedEvent ? (
          <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between border-b border-[#222] pb-4">
               <h2 className="text-xl font-light text-white flex flex-wrap items-center gap-3">
                 <span className="text-[#00FF41] font-mono uppercase text-sm font-bold">[02]</span> 
                 {selectedEvent.status === 'finished' ? 'ARCHIVED SESSION DATA' : 'LIVE SESSION LEADERBOARD'}
                 {selectedEvent && (
                   <div className={`flex items-center gap-2 px-3 py-1 rounded-sm border ${selectedEvent.status === 'finished' ? 'bg-[#888]/10 border-[#888]/30' : 'bg-[#00FF41]/10 border-[#00FF41]/30'}`}>
                     <span className={`text-[9px] font-mono font-bold uppercase tracking-tighter ${selectedEvent.status === 'finished' ? 'text-[#888]' : 'text-[#00FF41]'}`}>
                       {selectedEvent.status === 'finished' ? 'Archived Session //' : 'Active Session //'}
                     </span>
                     <span className="text-xs text-white font-mono font-bold">{selectedEvent.id}</span>
                   </div>
                 )}
               </h2>
               <div className="flex gap-4">
                  <div className="text-[10px] text-[#444] font-mono uppercase tracking-widest">
                    Session Submissions: <span className="text-[#00FF41]">{submissions.length}</span>
                  </div>
               </div>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {submissions.length > 0 ? submissions.sort((a,b) => b.totalHP - a.totalHP).map((sub, i) => (
                  <div key={sub.id || sub.teamId + sub.timestamp} className="sophisticated-panel p-5 flex items-center justify-between bg-[#111] border-[#222] hover:border-[#00FF41]/30 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className={`w-8 h-8 rounded-full border border-[#222] flex items-center justify-center text-[10px] font-mono ${i < 3 ? 'text-[#00FF41] border-[#00FF41]/30 bg-[#00FF41]/5' : 'text-[#444]'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-light text-white tracking-tight uppercase text-base group-hover:text-[#00FF41] transition-colors">{sub.teamId}</div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-[#666] uppercase font-mono tracking-widest mt-1">
                          <span>${sub.totalCost.toLocaleString()} BUDGET</span>
                          <span>•</span>
                          <span>{((sub.totalCost/selectedEvent.budget)*100).toFixed(1)}% EFFICIENCY</span>
                          <span>•</span>
                          <span className="text-[#888]">{sub.packageData?.length || 0} ASSETS</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                      <div className="hidden md:block">
                         <div className="text-[8px] text-[#444] uppercase font-mono text-right mb-1">Package Data</div>
                         <div className="flex gap-1 justify-end">
                            {sub.packageData?.slice(0, 5).map((p: any, idx: number) => (
                              <div key={idx} className="w-1.5 h-1.5 bg-[#222] rounded-full group-hover:bg-[#00FF41]/40 transition-colors" />
                            ))}
                         </div>
                      </div>
                      <div className="text-right border-l border-[#222] pl-4 md:pl-8">
                        <div className="text-[9px] text-[#444] uppercase font-mono mb-0.5">Final Score</div>
                        <div className="text-2xl font-mono text-[#00FF41] tabular-nums leading-none">
                          {sub.totalHP}
                          <span className="text-[10px] opacity-40 ml-1 uppercase tracking-tighter font-sans">HP</span>
                        </div>
                      </div>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          if(confirm(`Purge data for ${sub.teamId}?`)) {
                            try {
                              const targetId = sub.id || sub.teamId.trim().toUpperCase().replace(/\s+/g, '_');
                              await deleteDoc(doc(db, 'events', selectedEvent.id, 'submissions', targetId));
                            } catch (err) {
                              alert('ERR: ACCESS_DENIED // PURGE_FAILED');
                            }
                          }
                        }}
                        className="p-2 opacity-0 group-hover:opacity-100 transition-all text-red-500 hover:bg-red-500/10 rounded-sm"
                        title="Remove Team Data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-[#0A0A0A] border border-dashed border-[#222] rounded-sm group">
                    <div className="text-[#222] mb-4 flex justify-center">
                       <BarChart3 className="w-12 h-12 animate-pulse" />
                    </div>
                    <p className="text-[#444] text-[10px] uppercase font-bold tracking-[0.4em]">Intercepting Satellite Feed // No Data Detected</p>
                  </div>
                )}
             </div>
          </section>
        ) : (
          <section className="space-y-4 animate-in fade-in duration-700">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <h2 className="text-xl font-light text-white flex items-center gap-3">
                <span className="text-[#888] font-mono uppercase text-sm font-bold">[00]</span> SYSTEM ACTIVITY
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="sophisticated-panel p-6 bg-[#0D0D0D] border-[#222]">
                <Activity className="w-6 h-6 text-[#00FF41] mb-4" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2 font-mono">Live Monitoring</h3>
                <p className="text-xs text-[#666] leading-relaxed mb-4">
                  All remote connections are currently in STANDBY. Select an active session from above to monitor real-time player telemetry and performance metrics.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#444] font-mono">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse" />
                   LINK STATUS: OPERATIONAL
                </div>
              </div>
              <div className="sophisticated-panel p-6 bg-[#0D0D0D] border-[#222]">
                <TrendingUp className="w-6 h-6 text-blue-500 mb-4" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2 font-mono">Engagement Metrics</h3>
                <p className="text-xs text-[#666] leading-relaxed mb-4">
                   Track your event's engagement. See which benefits are most popular across all sessions and adjust your budget strategies accordingly.
                </p>
                <div className="flex gap-4">
                   <div className="text-center bg-[#000] px-3 py-1 border border-[#222] rounded-sm">
                      <div className="text-[8px] text-[#444] uppercase font-mono">Engagement</div>
                      <div className="text-xs font-mono text-white">NOMINAL</div>
                   </div>
                   <div className="text-center bg-[#000] px-3 py-1 border border-[#222] rounded-sm">
                      <div className="text-[8px] text-[#444] uppercase font-mono">Latency</div>
                      <div className="text-xs font-mono text-white">12ms</div>
                   </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6 border-b border-[#222] pb-4">
            <h2 className="text-xl font-light text-white flex items-center gap-3">
              <span className="text-[#00FF41] font-mono uppercase text-sm font-bold">[03]</span> GLOBAL ASSET LIBRARY
            </h2>
            <button 
              onClick={() => setIsAddingBenefit(true)}
              className="text-[10px] text-[#00FF41] border border-[#00FF41]/30 px-4 py-1.5 rounded-sm hover:bg-[#00FF41]/10 transition-all font-mono font-bold"
            >
              + ADD NEW ASSET
            </button>
          </div>

          {isAddingBenefit && (
            <motion.form 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddBenefit}
              className="sophisticated-panel p-6 border-[#00FF41]/20 bg-[#0A0A0A] mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
            >
              <div className="space-y-2">
                <label className="text-[10px] text-[#444] uppercase font-mono">Asset Name</label>
                <input 
                  required
                  className="w-full bg-[#111] border border-[#333] p-2 text-white font-mono text-xs focus:border-[#00FF41] outline-none"
                  value={newBenefit.name}
                  onChange={e => setNewBenefit({...newBenefit, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#444] uppercase font-mono">Cost ($)</label>
                <input 
                  required type="number"
                  className="w-full bg-[#111] border border-[#333] p-2 text-white font-mono text-xs focus:border-[#00FF41] outline-none"
                  value={newBenefit.cost}
                  onChange={e => setNewBenefit({...newBenefit, cost: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#444] uppercase font-mono">Happiness (HP)</label>
                <input 
                  required type="number"
                  className="w-full bg-[#111] border border-[#333] p-2 text-white font-mono text-xs focus:border-[#00FF41] outline-none"
                  value={newBenefit.happiness}
                  onChange={e => setNewBenefit({...newBenefit, happiness: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#444] uppercase font-mono">Category</label>
                <select 
                  className="w-full bg-[#111] border border-[#333] p-2 text-white font-mono text-xs focus:border-[#00FF41] outline-none"
                  value={newBenefit.category}
                  onChange={e => setNewBenefit({...newBenefit, category: e.target.value})}
                >
                  <option>Health</option>
                  <option>Lifestyle</option>
                  <option>Finance</option>
                  <option>Growth</option>
                  <option>Security</option>
                  <option>Food</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#00FF41] text-black font-bold text-[10px] uppercase font-mono">Register</button>
                <button type="button" onClick={() => setIsAddingBenefit(false)} className="px-4 py-2 bg-[#222] text-[#666] font-bold text-[10px] uppercase font-mono">X</button>
              </div>
            </motion.form>
          )}

          <div className="sophisticated-panel overflow-hidden border-[#222] bg-[#111]">
            <table className="w-full text-left border-collapse">
              <thead className="admin-list-header text-[10px] uppercase font-mono text-[#444]">
                <tr>
                  <th className="px-6 py-4">Benefit Asset</th>
                  <th className="px-6 py-4">Sector</th>
                  <th className="px-6 py-4">Cost ($)</th>
                  <th className="px-6 py-4">HP Factor</th>
                  <th className="px-6 py-4">Dim</th>
                  <th className="px-6 py-4 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {benefits.map(b => (
                  <tr key={b.id} className="hover:bg-[#0A0A0A] transition-colors group">
                    <td className="px-6 py-4 font-light text-white uppercase text-sm tracking-tight">{b.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] border border-[#222] text-[#888] px-2 py-0.5 rounded-sm uppercase font-mono border-dashed group-hover:border-[#00FF41]/30 group-hover:text-[#00FF41] transition-all">{b.category}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#00FF41] text-sm tabular-nums font-bold">${b.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-[#888] text-sm tabular-nums">{b.happiness} <span className="text-[8px] opacity-30">HP</span></td>
                    <td className="px-6 py-4 text-[10px] text-[#444] font-mono">{b.size}x{b.size}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteBenefit(b.id)}
                        className="p-2 opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

// Player Components
const PlayerView = () => {
  const [gameState, setGameState] = useState<'join' | 'lobby' | 'playing' | 'result'>('join');
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<Benefit[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventConfig | null>(null);
  const [teamName, setTeamName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [timer, setTimer] = useState(600);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get('session');
    if (sessionParam) {
      setSessionId(sessionParam.toUpperCase());
    }
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'benefits'), (snap) => {
      setBenefits(snap.docs.map(doc => doc.data() as Benefit));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && gameState === 'playing') {
      handleLockIn(true);
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  useEffect(() => {
    if (!activeEvent || gameState !== 'playing') return;
    
    const unsubSession = onSnapshot(doc(db, 'events', activeEvent.id), (snap) => {
      if (snap.exists() && (snap.data() as EventConfig).status === 'finished') {
        alert("Session Update: The administrator has concluded this session.");
        setGameState('join');
        setActiveEvent(null);
      } else if (!snap.exists()) {
        alert("Session Alert: The session has been deleted.");
        setGameState('join');
        setActiveEvent(null);
      }
    });

    return () => unsubSession();
  }, [activeEvent?.id, gameState]);

  const handleJoin = async () => {
    if (!sessionId) {
      alert("System Error: Session ID required for connection.");
      return;
    }
    if (!teamName) {
      alert("System Error: Team identification required.");
      return;
    }
    const eventDoc = await getDoc(doc(db, 'events', sessionId.toUpperCase()));
    if (eventDoc.exists()) {
      const data = eventDoc.data() as EventConfig;
      if (data.status === 'finished') {
        alert("Session Terminal: This session has been concluded by the administrator.");
        return;
      }
      setActiveEvent(data);
      setTimer(data.timer);
      setGameState('playing');
    } else {
      alert("Session not found. Please check the ID.");
    }
  };

  const totalCost = selectedBenefits.reduce((acc, curr) => acc + curr.cost, 0);
  const totalHP = selectedBenefits.reduce((acc, curr) => acc + curr.happiness, 0);
  const budget = activeEvent?.budget || 2500;
  const overBudget = totalCost > budget;

  const toggleBenefit = (b: Benefit) => {
    if (gameState !== 'playing') return;
    setError(null);
    if (selectedBenefits.find(item => item.id === b.id)) {
      setSelectedBenefits(selectedBenefits.filter(item => item.id !== b.id));
    } else {
      setSelectedBenefits([...selectedBenefits, b]);
    }
  };

  const handleLockIn = async (isTimeout = false) => {
    setError(null);

    if (!teamName.trim()) {
      if (isTimeout) {
        setGameState('join');
        return;
      }
      setError('System Error: Team name required for registration');
      return;
    }

    if (selectedBenefits.length === 0) {
      if (isTimeout) {
        setGameState('result');
        return;
      }
      setError('System Error: At least one asset must be selected');
      return;
    }

    if (overBudget && !isTimeout) {
      setError('System Error: Budget limit exceeded. Reallocate funds.');
      return;
    }

    if (!activeEvent) return;

    try {
      const subId = teamName.trim().toUpperCase().replace(/\s+/g, '_');
      await setDoc(doc(db, 'events', activeEvent.id, 'submissions', subId), {
        id: subId,
        eventId: activeEvent.id,
        teamId: teamName,
        packageData: selectedBenefits,
        totalCost,
        totalHP: overBudget ? 0 : totalHP,
        isOverBudget: overBudget,
        timestamp: serverTimestamp()
      });
      setGameState('result');
    } catch (err) {
      setError('Critical Error: Failed to transmit data to command center');
    }
  };

  if (gameState === 'join') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sophisticated-panel p-10 w-full max-w-sm border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="text-center mb-8 pb-6 border-b border-[#222]">
            <Monitor className="w-10 h-10 text-[#00FF41] mx-auto mb-4" />
            <h2 className="text-2xl font-light tracking-tight text-white uppercase">Player Terminal</h2>
            <p className="text-[10px] opacity-40 mt-1 uppercase tracking-[0.2em] font-mono font-bold">Awaiting remote connection</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] ml-1">Session ID</label>
              <input value={sessionId} onChange={e => setSessionId(e.target.value)} type="text" className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-4 py-3 mt-1 outline-none focus:border-[#00FF41] transition-all font-mono text-xs text-white" placeholder="BT-9942" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] ml-1">Team Identification</label>
              <input value={teamName} onChange={e => setTeamName(e.target.value)} type="text" className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-4 py-3 mt-1 outline-none focus:border-[#00FF41] transition-all font-mono text-xs text-white" placeholder="Squad One" />
            </div>
            <button 
              onClick={handleJoin}
              className="w-full bg-[#00FF41] text-black font-bold py-4 rounded-sm mt-6 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,255,65,0.2)]"
            >
              Initialize Workspace
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="sophisticated-panel p-12 w-full max-w-2xl text-center border-[#00FF41]/30 shadow-[0_0_80px_rgba(0,255,65,0.05)]"
        >
          <div className="mb-8 flex flex-col items-center">
             <div className="w-16 h-16 rounded-full border border-[#00FF41] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                <CheckCircle2 className="w-8 h-8 text-[#00FF41]" />
             </div>
             <h2 className="text-4xl font-light tracking-tight text-white uppercase tabular-nums">Mission Complete</h2>
             <p className="text-[11px] opacity-40 uppercase tracking-[0.4em] mt-2 font-mono font-bold">Package Locked // Analyzing Trade-offs</p>
          </div>
          
          <div className="grid grid-cols-3 gap-1 mb-12">
            <div className="p-6 sophisticated-panel border-[#222] bg-[#0A0A0A]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#444] mb-3">Efficiency</div>
              <div className="text-2xl font-mono text-white tabular-nums">{((totalCost/budget)*100).toFixed(1)}%</div>
            </div>
            <div className="p-6 sophisticated-panel border-[#00FF41]/20 bg-[#00FF41]/5">
              <div className="text-[10px] font-bold text-[#00FF41] uppercase tracking-widest mb-3">Net Score</div>
              <div className="text-2xl font-mono text-[#00FF41] tabular-nums">{totalHP} <span className="text-[10px] opacity-40">HP</span></div>
            </div>
            <div className="p-6 sophisticated-panel border-[#222] bg-[#0A0A0A]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#444] mb-3">Capital Saved</div>
              <div className="text-2xl font-mono text-white tabular-nums">${budget - totalCost}</div>
            </div>
          </div>

          <p className="text-[10px] opacity-40 max-w-sm mx-auto mb-10 font-mono uppercase tracking-widest leading-relaxed">
            Transmission successful. Telemetry locked. Follow instructions at the primary command monitor.
          </p>

          <button 
            onClick={() => setGameState('join')}
            className="px-10 py-3 bg-transparent border border-[#333] text-[10px] font-bold hover:border-[#00FF41] transition-all uppercase tracking-[0.2em] text-[#888] hover:text-white rounded-sm"
          >
            Reset Terminal
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-2 md:px-4 h-full flex flex-col gap-4 overflow-hidden bg-[#0A0A0A]">
      {/* HUD Bar */}
      <div className="sophisticated-panel p-4 flex flex-col md:flex-row items-center justify-between bg-[#111] border-[#222] gap-4 md:gap-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 px-3 py-1 bg-[#00FF41]/10 border-b border-l border-[#00FF41]/30 rounded-bl-sm flex items-center gap-2">
          <span className="text-[8px] text-[#00FF41] font-mono font-bold uppercase tracking-widest">Active Session //</span>
          <span className="text-[10px] text-white font-mono font-bold">{activeEvent?.id}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-4 md:gap-12">
          <div className="flex-1 md:flex-none">
            <div className="text-[9px] font-bold text-[#888] uppercase tracking-[0.2em] mb-1 font-mono">TMR // REMAINING</div>
            <div className={`px-4 py-2 rounded-sm border font-mono font-bold tabular-nums flex items-center gap-3 text-xl md:text-3xl transition-colors ${timer < 60 ? 'text-red-500 border-red-500/50 bg-red-500/5 animate-pulse' : 'text-[#00FF41] border-[#00FF41]/20 bg-[#00FF41]/5'}`}>
              <Timer className={`w-5 h-5 ${timer < 60 ? 'animate-spin-slow' : ''}`} /> 
              {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            </div>
          </div>
          <div className="w-full md:w-64 lg:w-72 order-3 md:order-2">
            <div className="flex justify-between items-end mb-1">
              <div className="text-[9px] font-bold text-[#888] uppercase tracking-[0.2em] flex items-center gap-1 font-mono">
                BUDGET // <span className={overBudget ? 'text-red-500' : 'text-[#00FF41]'}>ALLOCATION</span>
              </div>
              <div className={`text-xs font-mono font-bold tracking-tighter tabular-nums ${overBudget ? 'text-red-500' : 'text-white'}`}>
                ${totalCost.toLocaleString()} / ${budget.toLocaleString()}
              </div>
            </div>
            <div className="hud-bar">
              <motion.div 
                animate={{ width: `${Math.min((totalCost / budget) * 100, 100)}%` }} 
                className={`hud-fill ${overBudget ? 'danger' : ''}`}
              />
            </div>
          </div>
          <div className="flex-1 md:flex-none order-2 md:order-3 text-right md:text-left">
            <div className="text-[9px] font-bold text-[#888] uppercase tracking-[0.2em] mb-1 flex items-center justify-end md:justify-start gap-1 font-mono">
              HP // ACCUMULATED
            </div>
            <motion.div 
              key={totalHP}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-xl md:text-2xl font-mono font-bold text-[#00FF41] tabular-nums"
            >
              {totalHP} <span className="text-[10px] opacity-40 ml-0.5">HP</span>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-sm"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] text-red-500 font-mono font-bold uppercase tracking-tighter">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={handleLockIn}
            className={`w-full md:w-auto px-6 md:px-10 py-3 rounded-sm font-bold text-[10px] tracking-[0.3em] transition-all uppercase ${overBudget ? 'bg-[#1A1A1A] border border-[#222] text-[#444] cursor-not-allowed' : 'bg-[#00FF41] text-black hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(0,255,65,0.2)]'}`}
          >
            Lock In Package
          </button>
        </div>
      </div>

      {/* Workspace Split */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 pb-4">
        {/* Benefit Drawer */}
        <div className="w-full md:w-72 lg:w-80 h-1/2 md:h-full sophisticated-panel border-[#222] bg-[#111] flex flex-col p-4">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222]">
            <h3 className="font-bold text-[10px] text-[#888] uppercase tracking-[0.2em] flex items-center gap-2">
              <Plus className="w-3 h-3 text-[#00FF41]" /> Asset Inventory
            </h3>
            <span className="text-[9px] font-mono text-[#444] uppercase tracking-tighter">SEC: 1.0</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-none custom-scroll">
            {benefits.map(b => {
              const isSelected = selectedBenefits.find(item => item.id === b.id);
              return (
                <div 
                  key={b.id}
                  onClick={() => toggleBenefit(b)}
                  className={`benefit-card group p-3 ${isSelected ? 'selected' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-light text-xs md:text-sm text-white tracking-tight uppercase truncate max-w-[140px]">{b.name}</span>
                    <span className="text-[9px] font-mono text-[#00FF41] tabular-nums font-bold">+${b.cost}</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                     <div className="w-full bg-[#1A1A1A] h-1 rounded-full mr-4 group-hover:bg-[#222] transition-colors">
                        <div className="bg-[#444] h-full" style={{ width: `${(b.happiness / 100) * 100}%` }}></div>
                     </div>
                     <span className="text-[10px] font-mono text-[#888] tabular-nums whitespace-nowrap">{b.happiness} HP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid Canvas */}
        <div className="flex-1 h-1/2 md:h-full sophisticated-panel border-[#222] relative overflow-hidden bg-[#0A0A0A] flex flex-col p-4 md:p-8">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-[#444] uppercase tracking-[0.3em] font-mono mb-6">
            Interactive Construction Hub // v-1.2.4
          </div>
          
          <div className="overflow-y-auto flex-1 scrollbar-none">
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 w-full z-10">
              {selectedBenefits.map(b => (
                <motion.div 
                  layoutId={`benefit-${b.id}`}
                  key={b.id}
                  className="sophisticated-panel p-3 md:p-4 flex flex-col border-[#00FF41]/30 bg-[#111] relative group"
                >
                  <button 
                    onClick={() => toggleBenefit(b)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-900 border border-red-500/50 text-red-500 rounded-sm items-center justify-center flex opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <span className="text-[8px] border border-[#00FF41]/30 text-[#00FF41] px-1.5 py-0.5 rounded-sm w-fit mb-2 md:mb-3 uppercase font-mono tracking-tighter">{b.category}</span>
                  <span className="font-light text-xs md:text-sm text-white tracking-tight uppercase tabular-nums truncate mb-1">{b.name}</span>
                  <div className="mt-4 flex justify-between items-end border-t border-[#222] pt-2">
                    <div className="text-[10px] font-mono text-[#00FF41] tabular-nums font-bold">+{b.happiness} HP</div>
                    <div className="text-[9px] font-mono text-[#444] tabular-nums uppercase tracking-tighter">${b.cost}</div>
                  </div>
                </motion.div>
              ))}

              {selectedBenefits.length === 0 && (
                <div className="col-span-full h-32 md:h-64 flex flex-col items-center justify-center border border-dashed border-[#222] rounded-sm bg-black/20">
                  <Plus className="w-6 h-6 text-[#222] mb-3" />
                  <p className="text-[10px] font-bold text-[#444] uppercase tracking-[0.4em] font-mono text-center px-4">Awaiting Configuration Input</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'admin' | 'player'>('player');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = checking, true = yes, false = no
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Force player view if join link is present
    const params = new URLSearchParams(window.location.search);
    if (params.get('session')) {
      setView('player');
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', u.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else {
            // Master Admin Bootstrap: The user who requested the app
            if (u.email === 'mahendrasingh1032000@gmail.com') {
              await setDoc(doc(db, 'admins', u.uid), { 
                email: u.email, 
                role: 'owner',
                createdAt: serverTimestamp()
              });
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
        } catch (e) {
          console.error("Security handshake failed", e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(null);
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (e: any) {
      console.error("Login failed", e);
      if (e.code === 'auth/popup-blocked') {
        alert("Please enable popups for this site to login.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink selection:bg-brand-primary selection:text-black">
      <Navbar view={view} setView={setView} user={user} isAdmin={isAdmin} onLogin={handleLogin} />
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.3 }}
        >
          {view === 'admin' ? (
            !user ? (
              <div className="flex flex-col items-center justify-center min-h-[80vh] pt-20">
                <div className="sophisticated-panel p-12 text-center max-w-sm border-[#333]">
                  <LogIn className="w-12 h-12 text-[#00FF41] mx-auto mb-6 shadow-[0_0_20px_rgba(0,255,65,0.2)]" />
                  <h2 className="text-2xl font-light text-white mb-2 uppercase tracking-tight">Access Control</h2>
                  <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-10 font-mono font-bold">Encrypted Authorization Required</p>
                  <button 
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="w-full py-4 bg-[#00FF41] text-black font-bold rounded-sm tracking-[0.3em] text-[10px] uppercase shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait"
                  >
                    {isLoggingIn ? 'Connecting...' : 'Authenticate via Google'}
                  </button>
                </div>
              </div>
            ) : isAdmin === null ? (
              <div className="flex items-center justify-center min-h-[80vh] pt-20">
                <div className="text-[#00FF41] font-mono text-[10px] animate-pulse">VERIFYING CREDENTIALS...</div>
              </div>
            ) : isAdmin ? (
              <AdminDashboard />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[80vh] pt-20">
                 <div className="sophisticated-panel p-12 text-center max-w-md border-red-500/30">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-light text-white mb-2 uppercase tracking-tight">Access Denied</h2>
                  <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-6 font-mono font-bold">Your ID is not authorized for Admin ops</p>
                  
                  <div className="bg-[#0A0A0A] p-4 rounded border border-[#222] mb-8 text-left">
                    <div className="text-[8px] text-[#444] uppercase font-mono mb-1">Your Unique Identifier (UID)</div>
                    <div className="text-xs text-[#888] font-mono break-all select-all">{user.uid}</div>
                  </div>

                  <p className="text-[9px] text-[#444] leading-relaxed mb-8">
                    Add the above UID to the <span className="text-[#888]">"admins"</span> collection in your Firestore console to gain access.
                  </p>

                  <button 
                    onClick={() => auth.signOut()}
                    className="w-full py-3 bg-transparent border border-[#333] text-[#888] font-bold rounded-sm tracking-[0.2em] text-[10px] uppercase hover:border-red-500/50 hover:text-red-500 transition-all font-mono"
                  >
                    Logout System
                  </button>
                </div>
              </div>
            )
          ) : <PlayerView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
