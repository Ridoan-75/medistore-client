import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">💊</span>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                MediStore
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online pharmacy delivering quality healthcare products with care, convenience, and commitment to your well-being.
            </p>
            
            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-sm font-semibold mb-2 text-gray-300">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Your email" 
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 px-4">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Shop Medicines', href: '/shop' },
                { name: 'About Us', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-emerald-400 group-hover:w-4 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Customer Support</h3>
            <ul className="space-y-3">
              {[
                { name: 'Track Order', href: '/track' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Returns', href: '/returns' },
                { name: 'FAQs', href: '/faq' },
                { name: 'Privacy Policy', href: '/privacy' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-emerald-400 group-hover:w-4 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400">
                  123 Medical Plaza, Dhaka 1200, Bangladesh
                </p>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <a href="tel:+8801234567890" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  +880 1234-567890
                </a>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <a href="mailto:info@medistore.com" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  info@medistore.com
                </a>
              </div>

              {/* Social Media */}
              <div className="pt-2">
                <p className="text-sm font-semibold mb-3 text-gray-300">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
                    { icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
                    { icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
                    { icon: Linkedin, href: '#', color: 'hover:bg-blue-700' }
                  ].map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      className={`bg-gray-800 p-2.5 rounded-lg ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                    >
                      <social.icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright - Center */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-400">
            © 2026 MediStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}