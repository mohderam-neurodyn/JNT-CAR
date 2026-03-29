"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Cpu,
  Brain,
  ShieldCheck,
  Cog,
  SunMedium,
  Boxes,
  Rocket,
  Phone,
  Mail,
  Globe2,
} from "lucide-react";
import Chatbot from "@/components/Chatbot";
export default function NeuroDynSite() {
  const brand = useMemo(
    () => ({
      name: "NeuroDyn Tech Solutions",
      tagline: "Where Intelligence Meets Technology",
      primary: "#1B2B50",
      accent: "#3ECF8E",
      muted: "#A0A0A0",
    }),
    []
  );

  const services = [
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Software Solutions",
      desc: "Custom web & mobile apps, integrations, cloud-native builds, and automation.",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI & Automation",
      desc: "Practical AI workflows, chatbots, predictive analytics, RPA for SMEs.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "IT Services & Security",
      desc: "Managed IT, networking, cybersecurity basics, audits, and support SLAs.",
    },
    {
      icon: <Boxes className="h-6 w-6" />,
      title: "EV / Mobility Solutions",
      desc: "Series Hybrid EV architecture development, EV retrofit solutions.",
    },
    {
      icon: <SunMedium className="h-6 w-6" />,
      title: "Energy & Electronics",
      desc: "Solar solutions, smart energy management, and electronics prototyping.",
    },
    {
      icon: <Cog className="h-6 w-6" />,
      title: "R&D & Consultancy",
      desc: "Architecture reviews, technology roadmaps, and proof-of-concept builds.",
    },
  ];

  const industries = [
    "IT & SaaS",
    "Cybersecurity",
    "Retail & eCommerce",
    "EV / Hybrid",
    "Education",
    "Energy & Utilities",
  ];

  function handleContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = (data.get("name") as string) || "";
    const email = (data.get("email") as string) || "";
    const message = (data.get("message") as string) || "";
    const subject = encodeURIComponent(`New enquiry — ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:info@neurodyn.in?subject=${subject}&body=${body}`;
  }

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        background: `radial-gradient(1200px 600px at 10% 0%, rgba(62,207,142,0.15), transparent 60%), 
                     radial-gradient(1000px 600px at 90% 10%, rgba(27,43,80,0.5), transparent 60%), 
                     linear-gradient(180deg, #0b1220 0%, #0b1220 100%)`,
      }}
    >
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/5 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <div
              className="h-9 w-9 grid place-items-center rounded-2xl shadow-md"
              style={{ background: brand.accent }}
            >
              <Rocket className="h-5 w-5 text-black" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-wide">
                {brand.name}
              </div>
              <div className="text-xs text-white/70 -mt-1">{brand.tagline}</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#services" className="hover:text-white transition">
              Services
            </a>
            <a href="#industries" className="hover:text-white transition">
              Industries
            </a>
            <a href="#about" className="hover:text-white transition">
              About
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button className="rounded-2xl" asChild>
              <a href="#contact">Get in touch</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Build smarter with{" "}
              <span style={{ color: brand.accent }}>NeuroDyn</span>
            </h1>
            <p className="mt-4 text-white/80 text-lg">
              We deliver intelligent software, practical AI, and reliable
              components to power your next idea — from prototype to production.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-2xl" asChild>
                <a href="#services">Explore our solutions</a>
              </Button>
              <Button
                variant="secondary"
                className="rounded-2xl bg-white/10 text-white hover:bg-white/20"
                asChild
              >
                <a href="#about">Why us</a>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/60">
              {industries.map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center"
                >
                  {i}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-400/20 to-blue-500/10 blur-2xl rounded-3xl" />
              <Card className="relative rounded-3xl bg-white/5 border-white/10 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg">What we do</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  {services.slice(0, 4).map((s) => (
                    <div key={s.title} className="flex items-start gap-3">
                      <div className="rounded-xl bg-white/10 p-2">{s.icon}</div>
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-sm text-white/70">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Solutions built for real outcomes
          </h2>
          <span className="text-sm text-white/60">
            Flexible engagement • Clear SLAs • Vendor partnerships
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <Card
              key={s.title}
              className="rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 transition"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2">{s.icon}</div>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Why choose {brand.name}?
            </h2>
            <ul className="mt-6 space-y-3 text-white/80">
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-emerald-400" />{" "}
                Outcome-first delivery with transparent SLAs.
              </li>
              <li className="flex gap-3">
                <Brain className="mt-1 h-5 w-5 text-emerald-400" /> Practical AI
                that saves time and money — not hype.
              </li>
              <li className="flex gap-3">
                <Cpu className="mt-1 h-5 w-5 text-emerald-400" /> Full-stack
                capability: software + components + energy.
              </li>
              <li className="flex gap-3">
                <Globe2 className="mt-1 h-5 w-5 text-emerald-400" /> Global best
                practices with local support.
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-400/20 to-blue-500/10 blur-2xl rounded-3xl" />
            <Card className="relative rounded-3xl bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Quick facts</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4 text-sm text-white/80">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  Founded by hands-on engineers
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  Vendor network for fast sourcing
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  Security-first approach
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  Flexible engagement models
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-8 text-center">
          <h3 className="text-xl md:text-2xl font-semibold">
            Ready to turn your idea into reality?
          </h3>
          <p className="mt-2 text-white/80">
            Let’s scope a quick PoC or pilot in 2–4 weeks.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Button className="rounded-2xl" asChild>
              <a href="#contact">Start a conversation</a>
            </Button>
            <Button
              variant="secondary"
              className="rounded-2xl bg-white/10 text-white hover:bg-white/20"
              asChild
            >
              <a href="#services">View services</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Contact us</h2>
            <p className="mt-2 text-white/80">
              Tell us briefly about your project. We usually reply within 1
              business day.
            </p>
            <div className="mt-6 space-y-3 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +91-9935232167
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> mohd.eram@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4" /> www.neurodyn.in
              </div>
            </div>
          </div>
          <Card className="rounded-2xl bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Send a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContact} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Your name"
                  required
                  className="bg-white/10 border-white/20 placeholder:text-white/50"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="bg-white/10 border-white/20 placeholder:text-white/50"
                />
                <Textarea
                  name="message"
                  placeholder="Brief about your requirement"
                  rows={5}
                  required
                  className="bg-white/10 border-white/20 placeholder:text-white/50"
                />
                <Button type="submit" className="w-full rounded-2xl">
                  Send via Email
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <div>© {new Date().getFullYear()} {brand.name}. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6">
        <Chatbot />
      </div>
    </div>
  );
}
