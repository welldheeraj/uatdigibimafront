export default function Footer() {
  return (
    <footer className="w-full bg-[#4C6991] text-white text-sm px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">

        {/* Left Side: Footer Links */}
        <div className="flex flex-col gap-2 md:w-1/5">
          <a href="#" className="hover:underline hover:text-gray-200">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline hover:text-gray-200">
            Terms & Conditions
          </a>
          <a href="#" className="hover:underline hover:text-gray-200">
            Contact Us
          </a>
        </div>

        {/* Right Side: Company Info */}
        <div className="text-left md:w-4/5 space-y-3 leading-relaxed">
          <p>
            <strong>Digibima Insurance Web Aggregators Private Limited</strong> |
            CIN: U67110RJ2022PTC080500 | IRDAI License No.:
            IRDAI/INT/WBA/76/2023 | Valid till: <strong>09/08/2026</strong><br />
            Registered Office - 706 Gali no 6, New Sanganer Road, Jaipur,
            Rajasthan - 302019. Email:{" "}
            <a
              href="mailto:info@digibima.com"
              className="underline hover:text-gray-200"
            >
              info@digibima.com
            </a>
          </p>

          <p>
            Insurance is the subject matter of solicitation. Information on this portal
            is from the respective insurer. Visitors’ data may be shared with partner insurers.
          </p>

          <p>
            This website provides factual, unbiased information to help customers make
            informed insurance choices. We do not endorse any particular insurer.
          </p>

          <p className="pt-2">
            © 2024 <strong>DIGI BIMA</strong>. All Rights Reserved. Powered by{" "}
            <span className="font-semibold">Proactive</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
