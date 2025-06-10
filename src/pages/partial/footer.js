export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white px-4 py-6 text-center">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-5 text-xs sm:text-sm leading-relaxed">
        <p>
          Digibima Insurance Web Aggregators Private Limited | CIN: U67110RJ2022PTC080500 | 
          IRDAI License No.: IRDAI/INT/WBA/76/2023 | Valid till: 09/08/2026 <br />
          Registered Office - 706 Gali no 6, New Sanganer Road, Jaipur, Rajasthan – 302019. Email ID:{" "}
          <a href="mailto:info@digibima.com" className="underline">info@digibima.com</a>
        </p>
        
        <p>
          Insurance is the subject matter of solicitation. Information available on this portal is of the partner insurer
          with whom we have an agreement. The information displayed is solely based on the information received from the
          respective insurer. The visitors/prospects details may be shared with partner insurers.
        </p>

        <p>
          The information provided on this website/page is for information purposes only. Digibima does not in any form or
          manner endorse the information so provided on the website and strives to provide factual and unbiased information
          to customers to assist in making informed insurance choices.
        </p>

        <p className="text-white/40 pt-2">
          © 2024 DIGI BIMA. All Rights Reserved. Powered By Proactive.
        </p>
      </div>
    </footer>
  );
}
