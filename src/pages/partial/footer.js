import { FaLink, FaBuilding, FaMapMarkerAlt, FaInfoCircle, FaChevronRight } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="w-full bg-[#4C6991] text-white text-sm py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 px-6 lg:px-12">
        
        {/* Column 1: Quick Links */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-semibold text-base mb-3 border-b border-gray-400 pb-1 w-fit">
            <FaLink className="text-gray-200" /> Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center gap-2 hover:text-gray-200">
                <FaChevronRight className="text-xs" /> Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 hover:text-gray-200">
                <FaChevronRight className="text-xs" /> Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 hover:text-gray-200">
                <FaChevronRight className="text-xs" /> Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Company Info */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-semibold text-base mb-3 border-b border-gray-400 pb-1 w-fit">
            <FaBuilding className="text-gray-200" /> Company
          </h3>
          <p className="leading-relaxed">
            <strong>Digibima Insurance Web Aggregators Pvt Ltd</strong><br />
            CIN: U67110RJ2022PTC080500 <br />
            IRDAI License No: IRDAI/INT/WBA/76/2023 <br />
            Valid till: <strong>09/08/2026</strong>
          </p>
        </div>

        {/* Column 3: Office Address */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-semibold text-base mb-3 border-b border-gray-400 pb-1 w-fit">
            <FaMapMarkerAlt className="text-gray-200" /> Registered Office
          </h3>
          <p className="leading-relaxed">
            706 Gali no 6, New Sanganer Road,<br />
            Jaipur, Rajasthan - 302019
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:info@digibima.com"
              className="underline hover:text-gray-200"
            >
              info@digibima.com
            </a>
          </p>
        </div>

        {/* Column 4: Disclaimer */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 font-semibold text-base mb-3 border-b border-gray-400 pb-1 w-fit">
            <FaInfoCircle className="text-gray-200" /> Disclaimer
          </h3>
          <p className="leading-relaxed">
            Insurance is the subject matter of solicitation. Information on this
            portal is from the respective insurer. Visitors’ data may be shared with
            partner insurers.
          </p>
          <p className="leading-relaxed">
            This website provides factual, unbiased information to help customers make
            informed insurance choices. We do not endorse any particular insurer.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center mt-6 pt-4 border-t border-gray-400 text-xs px-6 lg:px-12">
        © 2024 <strong>DIGI BIMA</strong>. All Rights Reserved. Powered by{" "}
        <span className="font-semibold">Proactive</span>
      </div>
    </footer>
  );
}
