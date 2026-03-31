"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, CreditCard, CheckCircle2, Loader2, Send } from "lucide-react"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  price?: string
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { opacity: 0, scale: 0.95, y: 20 }
}

export function BookingModal({ isOpen, onClose, serviceName, price }: ModalProps) {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [date, setDate] = useState("")
  const [time, setTime] = useState("10:00")
  const [paymentMethod, setPaymentMethod] = useState("upi")

  const handleNext = () => setStep(2)

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setStep(3)
    }, 1500)
  }

  const resetAndClose = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      setDate("")
      setTime("10:00")
    }, 500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            variants={overlayVariants} 
            initial="hidden" 
            animate="visible" 
            exit="hidden" 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={resetAndClose}
          />
          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[var(--fin-border-divider)]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--fin-border-divider)] bg-[var(--fin-bg-primary)]/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[var(--fin-text-primary)] text-lg">Book Session</h3>
                <p className="text-xs text-[var(--fin-text-secondary)] font-medium truncate max-w-[250px]">{serviceName}</p>
              </div>
              <button onClick={resetAndClose} className="p-2 rounded-full hover:bg-black/5 text-[var(--fin-text-secondary)] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--fin-text-primary)] mb-1.5">Select Date</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--fin-text-primary)] mb-1.5">Select Time</label>
                      <select 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors bg-white font-medium"
                      >
                        <option value="10:00">10:00 AM IST</option>
                        <option value="14:00">02:00 PM IST</option>
                        <option value="18:00">06:00 PM IST</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={handleNext}
                      disabled={!date}
                      className="w-full py-3.5 bg-[var(--fin-text-primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2A2420] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Calendar size={18} />
                      Next: Payment ({price})
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-[var(--fin-bg-primary)] p-4 rounded-xl border border-[var(--fin-border-light)]/40 mb-6">
                    <p className="text-sm font-medium text-[var(--fin-text-secondary)]">Total Amount due</p>
                    <p className="text-3xl font-bold text-[var(--fin-text-primary)]">{price}</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-[var(--fin-text-primary)]">Select Payment Method</label>
                    <div 
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center gap-3 ${paymentMethod === 'upi' ? 'border-[var(--fin-accent-gold)] bg-[var(--fin-bg-primary)]' : 'border-[var(--fin-border-divider)] hover:border-[var(--fin-border-light)]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[var(--fin-accent-gold)]' : 'border-gray-300'}`}>
                        {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-[var(--fin-accent-gold)] rounded-full" />}
                      </div>
                      <span className="font-medium text-[var(--fin-text-primary)]">UPI (GPay, PhonePe, Paytm)</span>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center gap-3 ${paymentMethod === 'card' ? 'border-[var(--fin-accent-gold)] bg-[var(--fin-bg-primary)]' : 'border-[var(--fin-border-divider)] hover:border-[var(--fin-border-light)]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[var(--fin-accent-gold)]' : 'border-gray-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-[var(--fin-accent-gold)] rounded-full" />}
                      </div>
                      <span className="font-medium text-[var(--fin-text-primary)]">Credit / Debit Card</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-5 py-3.5 border border-[var(--fin-border-divider)] rounded-xl font-bold text-[var(--fin-text-secondary)] hover:bg-[var(--fin-bg-secondary)] transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 py-3.5 bg-[var(--fin-accent-gold)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#b5954e] transition-colors disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <><Loader2 size={18} className="animate-spin" /> Processing...</>
                      ) : (
                        <><CreditCard size={18} /> Pay Securely</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="py-8 text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[var(--fin-text-primary)]">Booking Confirmed!</h3>
                  <p className="text-[var(--fin-text-secondary)] text-sm max-w-[280px] mx-auto leading-relaxed">
                    Your session for <span className="font-bold">{serviceName}</span> is scheduled. We have sent the joining details to your email.
                  </p>
                  <div className="pt-6">
                    <button 
                      onClick={resetAndClose}
                      className="w-full py-3.5 bg-[var(--fin-text-primary)] text-white rounded-xl font-bold hover:bg-[#2A2420] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function InquiryModal({ isOpen, onClose, serviceName }: Omit<ModalProps, 'price'>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  const resetAndClose = () => {
    onClose()
    setTimeout(() => {
      setSubmitted(false)
    }, 500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            variants={overlayVariants} 
            initial="hidden" 
            animate="visible" 
            exit="hidden" 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={resetAndClose}
          />
          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[var(--fin-border-divider)] max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--fin-border-divider)] bg-[var(--fin-bg-primary)]/50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold text-[var(--fin-text-primary)] text-lg">Inquiry Form</h3>
                <p className="text-xs text-[var(--fin-text-secondary)] font-medium truncate max-w-[300px]">{serviceName}</p>
              </div>
              <button onClick={resetAndClose} className="p-2 rounded-full hover:bg-black/5 text-[var(--fin-text-secondary)] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--fin-text-primary)] mb-1.5">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--fin-text-primary)] mb-1.5">Company (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Your Company"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--fin-text-primary)] mb-1.5">Email</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--fin-text-primary)] mb-1.5">Phone</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--fin-text-primary)] mb-1.5">Requirements / Message</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Briefly describe what you are looking for..."
                      className="w-full px-4 py-3 rounded-xl border border-[var(--fin-border-divider)] focus:outline-none focus:border-[var(--fin-accent-gold)] focus:ring-1 focus:ring-[var(--fin-accent-gold)] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[var(--fin-text-primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2A2420] transition-colors disabled:opacity-70 disabled:cursor-wait"
                    >
                      {isSubmitting ? (
                        <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                      ) : (
                        <><Send size={18} /> Submit Inquiry</>
                      )}
                    </button>
                    <p className="text-center text-xs text-[var(--fin-text-light)] mt-4">
                      Or email us directly at: <a href="mailto:pujarishobhac@gmail.com" className="font-semibold underline hover:text-[var(--fin-accent-gold)]">pujarishobhac@gmail.com</a>
                    </p>
                  </div>
                </form>
              ) : (
                <div className="py-10 text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 bg-[var(--fin-bg-secondary)] text-[var(--fin-accent-gold)] rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[var(--fin-text-primary)]">Inquiry Received!</h3>
                  <p className="text-[var(--fin-text-secondary)] text-sm max-w-[300px] mx-auto leading-relaxed">
                    Thank you for reaching out regarding <span className="font-bold">{serviceName}</span>. 
                    Our team will review your requirements and get back to you shortly.
                  </p>
                  <div className="pt-6">
                    <button 
                      onClick={resetAndClose}
                      className="w-full py-3.5 bg-white border border-[var(--fin-border-divider)] text-[var(--fin-text-primary)] rounded-xl font-bold hover:bg-[var(--fin-bg-primary)] transition-colors shadow-sm"
                    >
                      Close Form
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
