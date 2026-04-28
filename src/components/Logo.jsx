/* Brand logo — #7cb26e green identity */
export default function Logo({ dark = false, size = 36 }) {
  return (
    <span className="inline-flex items-center gap-2 select-none" aria-label="Aizaz Ali Afridi">
      {/* Leaf-code icon mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="18" cy="18" r="18" fill="#7cb26e" />
        {/* Stylised "A" as code brackets */}
        <path d="M10 24 L14 12 L18 20 L22 12 L26 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Dot accent */}
        <circle cx="18" cy="27" r="1.8" fill="white" />
      </svg>

      {/* Wordmark */}
      <span className="font-display font-black text-xl leading-none">
        <span
          style={{
            background: dark
              ? 'linear-gradient(135deg, #7cb26e 0%, #a3c89a 100%)'
              : 'linear-gradient(135deg, #5a9a4a 0%, #7cb26e 50%, #a3c89a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Aizaz
        </span>
        <span className={dark ? 'text-white' : 'text-gray-800'}>.</span>
      </span>
    </span>
  );
}
