import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  platform: {
    title: "المنصة",
    links: ["الإعلانات", "الفئات", "الأسعار والباقات", "التحقق والتوثيق"],
  },
  categories: {
    title: "الفئات",
    links: ["الإبل", "الأغنام والماعز", "الأبقار", "الأعلاف", "المزارع"],
  },
  support: {
    title: "الدعم",
    links: ["مركز المساعدة", "سياسة الخصوصية", "الشروط والأحكام", "تواصل معنا"],
  },
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">ص</span>
              </div>
              <div>
                <div className="font-bold text-lg text-accent leading-none">الصفاة</div>
                <div className="text-[10px] text-primary-foreground/50 leading-none">Al-Safah Marketplace</div>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-5">
              المنصة الرقمية الأولى لتداول المواشي والمنتجات الزراعية في المملكة العربية السعودية ومنطقة الخليج.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <span>920-000-000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <span>info@alsafah.sa</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-primary-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-primary-foreground/60 text-sm hover:text-accent transition-colors cursor-pointer"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/40 text-sm">
            &copy; {new Date().getFullYear()} الصفاة. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/40">
            <a href="#" className="hover:text-accent transition-colors cursor-pointer">سياسة الخصوصية</a>
            <a href="#" className="hover:text-accent transition-colors cursor-pointer">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
