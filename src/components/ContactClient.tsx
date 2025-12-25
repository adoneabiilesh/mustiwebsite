'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactClientProps {
    settings: {
        email: string;
        phone: string;
        address: string;
    } | null;
}

export default function ContactClient({ settings }: ContactClientProps) {
    const defaultEmail = "SUPPORT@LEVEL.APP";
    const defaultPhone = "+1 (800) BOLD-FOOD";
    const defaultAddress = "123 BOLD STREET, MIAMI, FL 33101";

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-12">
            <h1 className="text-6xl font-black uppercase tracking-tighter text-center">
                GET IN TOUCH
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-2">
                            <Mail className="w-6 h-6 text-crimson" />
                            <h3 className="font-black uppercase tracking-widest text-xs">Email Us</h3>
                        </div>
                        <p className="font-bold uppercase text-sm">{settings?.email || defaultEmail}</p>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-2">
                            <Phone className="w-6 h-6 text-crimson" />
                            <h3 className="font-black uppercase tracking-widest text-xs">Call Us</h3>
                        </div>
                        <p className="font-bold uppercase text-sm">{settings?.phone || defaultPhone}</p>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-2">
                            <MapPin className="w-6 h-6 text-crimson" />
                            <h3 className="font-black uppercase tracking-widest text-xs">Our Spot</h3>
                        </div>
                        <p className="font-bold uppercase text-sm">{settings?.address || defaultAddress}</p>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="p-10">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle>SEND A MESSAGE</CardTitle>
                            <CardDescription>GOT A PROBLEM? OR JUST WANT TO SAY HI? WE'RE ALL EARS.</CardDescription>
                        </CardHeader>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Your Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border-2 border-dead-black rounded-full px-6 py-3 font-bold uppercase text-sm focus:outline-none focus:ring-2 focus:ring-crimson/20"
                                        placeholder="NAME"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Your Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-white border-2 border-dead-black rounded-full px-6 py-3 font-bold uppercase text-sm focus:outline-none focus:ring-2 focus:ring-crimson/20"
                                        placeholder="EMAIL"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Subject</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border-2 border-dead-black rounded-full px-6 py-3 font-bold uppercase text-sm focus:outline-none focus:ring-2 focus:ring-crimson/20"
                                    placeholder="SUBJECT"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-white border-2 border-dead-black rounded-3xl px-6 py-4 font-bold uppercase text-sm focus:outline-none focus:ring-2 focus:ring-crimson/20 resize-none"
                                    placeholder="WHAT'S ON YOUR MIND?"
                                />
                            </div>
                            <Button variant="crimson" className="w-full h-14 text-lg">
                                <Send className="w-6 h-6 mr-4" />
                                SEND MESSAGE
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
