type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean };
type ClassValues = ClassValue | ClassValue[];

export function cn(...inputs: ClassValues[]): string {
  const classes: string[] = [];

  inputs.forEach(input => {
    if (!input) return;

    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      Object.entries(input).forEach(([className, condition]) => {
        if (condition) {
          classes.push(className);
        }
      });
    }
  });

  return classes.filter(Boolean).join(" ");
}
