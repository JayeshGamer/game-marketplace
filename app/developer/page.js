"use client";

import SyncButton from "@/components/SyncButton";

export default function DeveloperDashboard() {
    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 pt-40 px-12 pb-24 font-display max-w-7xl mx-auto flex flex-col">
            <div className="flex flex-col md:flex-row items-center justify-between border-b-4 border-neutral-900 pb-8 mb-12 gap-6 md:gap-0">
                <div className="bg-white border-4 border-neutral-900 p-6 shadow-[8px_8px_0_#171717] w-full md:w-auto">
                    <span className="text-[12px] bg-neutral-900 text-white px-2 py-1 font-black tracking-[0.4em] uppercase mb-4 border-2 border-neutral-900 inline-block">Developer Portal</span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">The Forge</h1>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                    <SyncButton />
                    <button className="w-full md:w-auto bg-primary border-4 border-neutral-900 text-neutral-900 hover:bg-orange-600 px-8 py-4 text-[12px] font-black tracking-[0.2em] uppercase transition-all shadow-[4px_4px_0_#171717] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#171717] flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-lg font-black">upload</span>
                        Upload Build
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                <div className="lg:col-span-1 space-y-8">
                    <div className="p-6 bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#ff4500]">
                        <span className="text-[12px] font-black tracking-[0.2em] text-neutral-900 bg-primary px-2 py-1 uppercase block w-fit border-2 border-neutral-900 mb-4">Total Revenue</span>
                        <span className="text-3xl font-black font-mono text-neutral-900">$14,285.00</span>
                    </div>
                    <div className="p-6 bg-neutral-900 border-4 border-neutral-900 shadow-[8px_8px_0_#171717] text-white">
                        <span className="text-[12px] font-black tracking-[0.2em] uppercase text-neutral-400 border-b-2 border-neutral-700 pb-2 mb-4 block w-fit">Active Titles</span>
                        <span className="text-5xl font-black font-mono text-white">03</span>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <h2 className="text-xl font-black tracking-widest uppercase text-neutral-900 mb-8 border-b-4 border-neutral-900 pb-4 inline-block">Published Titles Matrix</h2>
                    <div className="w-full bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717]">
                        <table className="w-full text-left border-collapse font-mono">
                            <thead>
                                <tr className="bg-neutral-900 text-white text-[10px] tracking-widest uppercase border-b-4 border-neutral-900">
                                    <th className="p-4 font-black">Asset Name</th>
                                    <th className="p-4 font-black">Status</th>
                                    <th className="p-4 font-black">Price</th>
                                    <th className="p-4 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs uppercase font-bold text-neutral-900">
                                <tr className="border-b-4 border-neutral-900 hover:bg-neutral-100 transition-colors">
                                    <td className="p-4 font-black text-sm">Aether Drift</td>
                                    <td className="p-4"><span className="text-neutral-900 border-2 border-neutral-900 bg-green-400 px-2 py-1 text-[10px] tracking-widest font-black">LIVE</span></td>
                                    <td className="p-4 font-mono">$28.00</td>
                                    <td className="p-4 text-right">
                                        <button className="bg-neutral-200 border-2 border-neutral-900 p-2 hover:bg-primary transition-colors shadow-[2px_2px_0_#171717] hover:shadow-[4px_4px_0_#171717] hover:-translate-y-0.5"><span className="material-symbols-outlined text-[16px] font-black">edit</span></button>
                                    </td>
                                </tr>
                                <tr className="border-b-4 border-neutral-900 hover:bg-neutral-100 transition-colors">
                                    <td className="p-4 font-black text-sm">Cyber Protocol</td>
                                    <td className="p-4"><span className="text-neutral-900 border-2 border-neutral-900 bg-primary px-2 py-1 text-[10px] tracking-widest font-black">BETA</span></td>
                                    <td className="p-4 font-mono">$60.00</td>
                                    <td className="p-4 text-right">
                                        <button className="bg-neutral-200 border-2 border-neutral-900 p-2 hover:bg-primary transition-colors shadow-[2px_2px_0_#171717] hover:shadow-[4px_4px_0_#171717] hover:-translate-y-0.5"><span className="material-symbols-outlined text-[16px] font-black">edit</span></button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-neutral-100 transition-colors">
                                    <td className="p-4 font-black text-sm">Neon Shadow</td>
                                    <td className="p-4"><span className="text-neutral-900 border-2 border-neutral-900 bg-green-400 px-2 py-1 text-[10px] tracking-widest font-black">LIVE</span></td>
                                    <td className="p-4 font-mono">$40.00</td>
                                    <td className="p-4 text-right">
                                        <button className="bg-neutral-200 border-2 border-neutral-900 p-2 hover:bg-primary transition-colors shadow-[2px_2px_0_#171717] hover:shadow-[4px_4px_0_#171717] hover:-translate-y-0.5"><span className="material-symbols-outlined text-[16px] font-black">edit</span></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
