import Image from "next/image";

import { cn } from "@/lib/utils";

const avitarSrcs = [
  "avitars/avitar-01.svg",
  "avitars/avitar-02.svg",
  "avitars/avitar-03.svg",
  "avitars/avitar-04.svg",
  "avitars/avitar-05.svg",
  "avitars/avitar-06.svg",
  "avitars/avitar-07.svg",
  "avitars/avitar-08.svg",
  "avitars/avitar-09.svg",
  "avitars/avitar-10.svg",
];

interface AvitarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Image>, "src" | "alt"> {
  id: string;
}

export function Avitar({ id, className, ...rest }: AvitarProps) {
  const seed = cyrb128(id);
  const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
  const src = avitarSrcs[Math.floor(rand() * avitarSrcs.length)];

  return (
    <Image
      src={src}
      alt="User avitar"
      height={44}
      width={44}
      className={cn("h-11 w-11", className)}
      {...rest}
    />
  );
}

// Thanks bryc!
// https://stackoverflow.com/a/47593316

function cyrb128(str: string) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  (h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1);
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}
