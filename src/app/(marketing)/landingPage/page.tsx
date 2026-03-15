
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from '@/src/components/ui/Footer'

export default function LandingPage() {
  const router = useRouter();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbsRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const handleClick = () => {
    setLoading(true);
    router.push("/sign-up");
  };

  useEffect(() => {
  const timer = setTimeout(() => {
    setPageLoading(false);
  }, 1000); 

  return () => clearTimeout(timer);
}, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!orbsRef.current) return;
      const orbs = orbsRef.current.querySelectorAll(".orb");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        (orb as HTMLElement).style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: '💬',
      title: 'AI Career Chat Assistant',
      description:
        'Ask career questions, get personalized guidance, and continue conversations with saved chat history whenever you return.'
    },
    {
      icon: '🎙️',
      title: 'Voice Mock Interviews',
      description:
        'Practice interview conversations in a realistic voice format to improve confidence, clarity, and speaking performance.'
    },
    {
      icon: '🧠',
      title: 'Technical Quiz Practice',
      description:
        'Generate role-focused questions, test your knowledge, and get instant explanations to strengthen weak concepts.'
    },
    {
      icon: '📊',
      title: 'Technical Quiz Performance Tracking',
      description:
        'Review your assessment scores over time through charts and summaries that show your interview readiness progress.'
    },
    {
      icon: '📄',
      title: 'AI Resume Studio',
      description:
        'Create multiple resumes, edit every section with live preview, and improve your summary and experience with AI support.'
    },
    {
      icon: '🗺️',
      title: 'Career Roadmap Generator',
      description:
        'Build a personalized step-by-step roadmap for your target role and revisit your previously generated roadmaps anytime.'
    },
    {
      icon: '📈',
      title: 'Industry Insights Dashboard',
      description:
        'Explore salary ranges, hiring demand, market trends, and recommended skills aligned with your selected industry.'
    },
    {
      icon: '🧭',
      title: 'Personalized Onboarding',
      description:
        'Set your goals, role preferences, and skills during onboarding so your tools and recommendations feel tailored to you.'
    },
  
    {
      icon: '💳',
      title: 'Plan & Access Controls',
      description:
        'Use available plans and access settings to manage how premium interview features are enabled in your account.'
    }
  ];

if (pageLoading) {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );
}

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white overflow-x-hidden"
    >
      {/* Background Orbs */}
      <motion.div
        ref={orbsRef}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
      >
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </motion.div>

      {/* Navbar */}
      <nav className="fixed top-0 h-16 w-full bg-black/20 flex  px-3 py-2 text-lg font-bold z-50 backdrop-blur-md border border-2px-solid-white">
        <Image src="/InterviewXlogo.png" alt="Logo" height={20} width={45} />
        <div className="text-3xl font-bold ml-2">InterviewX</div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative px-12 pt-24 pb-12 z-10">
       
        <div className="text-center max-w-4xl">

     <motion.div
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: [0, -15, 0], opacity: 1 }}
  transition={{
    y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
    opacity: { duration: 1 }
  }}
  className="relative w-52 h-52 mx-auto mb-10 flex items-center justify-center"
>
  

  {/* Logo */}
  <Image
    src="/InterviewXlogo.png"
    alt="InterviewX Logo"
    width={200}
    height={200}
    priority
  />
</motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-6xl font-bold mb-5">
            InterviewX
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-2xl text-gray-400 mb-10">
            Transform Your Interview Process with AI Intelligence
          </motion.p>
          <div className="flex justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            disabled={loading}
            className="px-10 py-4 text-lg rounded-full bg-gradient-to-r from-blue-900 to-blue-500 shadow-lg shadow-blue-500/40 flex items-center justify-center gap-3"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Get Started"}
          </motion.button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-12 bg-gradient-to-b from-black to-slate-900">
        <h2 className="text-5xl font-bold text-center mb-14">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-white/5 p-10 rounded-2xl backdrop-blur-md border border-white/10 hover:shadow-2xl hover:shadow-blue-500/40"
            >
              <div className="text-5xl mb-5">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>

     <Footer/>

    </>
  );
}
