import React, { useState, useRef } from 'react';
import { Camera, Plus, ChevronDown, Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const AddVehicle = () => {
    const [primaryImage, setPrimaryImage] = useState(null);
    const [otherImages, setOtherImages] = useState([null, null, null, null]);
    const primaryInputRef = useRef(null);
    const otherInputsRef = useRef([]);

    const handlePrimaryImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPrimaryImage(URL.createObjectURL(file));
        }
    };

    const handleOtherImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const newOtherImages = [...otherImages];
            newOtherImages[index] = URL.createObjectURL(file);
            setOtherImages(newOtherImages);
        }
    };

    const removePrimaryImage = (e) => {
        e.stopPropagation();
        setPrimaryImage(null);
        if (primaryInputRef.current) {
            primaryInputRef.current.value = '';
        }
    };

    const removeOtherImage = (e, index) => {
        e.stopPropagation();
        const newOtherImages = [...otherImages];
        newOtherImages[index] = null;
        setOtherImages(newOtherImages);
        if (otherInputsRef.current[index]) {
            otherInputsRef.current[index].value = '';
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex justify-between items-center bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
                    <p className="text-gray-600 text-sm mt-1">Register a new asset to your rental fleet.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                        Save Draft
                    </button>
                    <button className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                        Publish Vehicle
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">

                    {/* Visual Assets */}
                    <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Visual Assets</h3>
                            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Required</span>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div 
                                className="col-span-2 aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                                onClick={() => primaryInputRef.current?.click()}
                            >
                                {primaryImage ? (
                                    <>
                                        <img src={primaryImage} alt="Primary" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-sm font-bold">Change Image</p>
                                        </div>
                                        <button 
                                            onClick={removePrimaryImage}
                                            className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full text-gray-700 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-white rounded-full group-hover:bg-blue-50 transition-colors">
                                            <Camera className="text-gray-500 group-hover:text-blue-600" size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-gray-900">Upload Primary Image</p>
                                            <p className="text-[10px] text-gray-500 mt-1">High-res JPG or PNG (Max 5MB)</p>
                                        </div>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    ref={primaryInputRef} 
                                    onChange={handlePrimaryImageUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </div>

                            {[0, 1, 2, 3].map((index) => (
                                <div 
                                    key={index} 
                                    className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-500/50 transition-all text-gray-600 hover:text-blue-600 relative overflow-hidden group"
                                    onClick={() => otherInputsRef.current[index]?.click()}
                                >
                                    {otherImages[index] ? (
                                        <>
                                            <img src={otherImages[index]} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-bold">Change</p>
                                            </div>
                                            <button 
                                                onClick={(e) => removeOtherImage(e, index)}
                                                className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white rounded-full text-gray-700 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </>
                                    ) : (
                                        <Plus size={24} />
                                    )}
                                    <input 
                                        type="file" 
                                        ref={(el) => (otherInputsRef.current[index] = el)} 
                                        onChange={(e) => handleOtherImageUpload(e, index)} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Vehicle Details */}
                    <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Vehicle Details</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Display Name</label>
                                <input type="text" placeholder="e.g. 2024 Porsche 911 Carrera" className="w-full bg-white border border-gray-200 p-4 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Brand</label>
                                <div className="relative">
                                    <select className="w-full bg-white border border-gray-200 p-4 text-sm appearance-none cursor-pointer">
                                        <option>Porsche</option>
                                        <option>Tesla</option>
                                        <option>BMW</option>
                                        <option>Audi</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Vehicle Type</label>
                                <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
                                    {['2 Wheeler', '4 Wheeler', 'EV'].map((type) => (
                                        <button key={type} className={cn(
                                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                            type === '4 Wheeler' ? "bg-white border border-gray-200 text-gray-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                        )}>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Model Year</label>
                                <input type="text" placeholder="2024" className="w-full bg-white border border-gray-200 p-4 text-sm" />
                            </div>
                        </div>
                    </section>

                    {/* Marketing Copy */}
                    <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Vehicle Description & Editorial</h3>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Marketing Copy</label>
                            <textarea
                                rows={6}
                                placeholder="Describe the driving experience, unique performance specs, and condition..."
                                className="w-full bg-white border border-gray-200 p-4 text-sm resize-none"
                            ></textarea>
                        </div>
                    </section>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-8">
                    {/* Pricing & Logistics */}
                    <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Pricing & Logistics</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Daily Rental Rate</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">NPR</span>
                                    <input type="text" placeholder="450" className="w-full bg-white border border-gray-200 py-4 pl-14 pr-4 text-sm font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Security Deposit</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold">NPR</span>
                                    <input type="text" placeholder="2500" className="w-full bg-white border border-gray-200 py-4 pl-14 pr-4 text-sm font-bold" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <span className="text-sm font-bold text-gray-900">Mandatory Insurance</span>
                                <button className="w-12 h-6 bg-blue-600 rounded-full relative p-1 transition-all">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Configuration */}
                    <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Configuration</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Transmission</label>
                                <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
                                    {['Automatic', 'Manual'].map((mode) => (
                                        <button key={mode} className={cn(
                                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                            mode === 'Automatic' ? "bg-white border border-gray-200 text-gray-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                        )}>
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Seating Capacity</label>
                                <div className="relative">
                                    <select className="w-full bg-white border border-gray-200 p-4 text-sm appearance-none cursor-pointer">
                                        <option>2 Seater</option>
                                        <option>4 Seater</option>
                                        <option>5 Seater</option>
                                        <option>7 Seater</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Premium Features</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Sunroof', 'Autopilot', 'Heated Seats', 'AWD'].map((feature) => (
                                        <button key={feature} className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all",
                                            ['Sunroof', 'Autopilot'].includes(feature)
                                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                                : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-200"
                                        )}>
                                            {feature}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="fixed bottom-0 left-64 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-between items-center z-20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Draft Status: Unsaved</span>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                        Save Draft
                    </button>
                    <button className="px-10 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all">
                        Publish Vehicle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddVehicle;
