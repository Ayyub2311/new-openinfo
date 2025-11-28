import Image from "next/image";

const COLORS = [
  "#FF5E5B",
  "#00CECB",
  "#FF9F1C",
  "#A463F2",
  "#00D166",
  "#FF36AB",
  "#00B4D8",
  "#FF6D00",
  "#7B2CBF",
  "#FFD166",
  "#EF476F",
  "#06D6A0",
];

function getColorFromId(id: number): string {
  return COLORS[id % COLORS.length];
}

function getInitials(name: string): string {
  return name
    .replace(/[^a-zA-Z\s]/g, "") // remove all but letters/spaces
    .split(" ")
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface OrgLogoProps {
  id: number;
  shortName: string;
  logoFile?: string;
  size?: number; // default to 40
}

const OrgLogo = ({ id, shortName, logoFile = "", size = 40 }: OrgLogoProps) => {
  const bgColor = getColorFromId(id);
  const initials = getInitials(shortName);
  const hasLogo = !!logoFile;
  return hasLogo ? (
    <div
      className="rounded-xl overflow-hidden p-1 flex items-center justify-center border border-default dark:border-gray-600"
      style={{
        width: size,
        height: size,
        minWidth: size,
      }}
    >
      <Image src={logoFile} alt={shortName} width={size} height={size} className="object-contain" unoptimized />
    </div>
  ) : (
    <div
      className="flex items-center justify-center rounded-xl text-white font-semibold flex-shrink-0"
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        minWidth: size,
        fontSize: size / 2.2,
        lineHeight: `${size}px`,
        textAlign: "center",
      }}
    >
      {initials}
    </div>
  );
};

export default OrgLogo;
