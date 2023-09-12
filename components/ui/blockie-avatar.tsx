// Credit: https://raw.githubusercontent.com/download13/blockies/master/src/blockies.mjs

// The random number is a js implementation of the Xorshift PRNG

class Blockie {
  seed: string;
  randseed: [number, number, number, number];
  size: number;
  scale: number;
  color: string;
  bgColor: string;
  spotColor: string;

  constructor(seed: string) {
    this.seed =
      seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);

    this.randseed = [0, 0, 0, 0];
    for (let i = 0; i < seed.length; i++) {
      this.randseed[i % 4] =
        (this.randseed[i % 4] << 5) - this.randseed[i % 4] + seed.charCodeAt(i);
    }

    this.size = 8;
    this.scale = 4;
    this.color = this.createColor();
    this.bgColor = this.createColor();
    this.spotColor = this.createColor();
  }

  rand() {
    // based on Java's String.hashCode(), expanded to 4 32bit values
    const t = this.randseed[0] ^ (this.randseed[0] << 11);

    this.randseed[0] = this.randseed[1];
    this.randseed[1] = this.randseed[2];
    this.randseed[2] = this.randseed[3];
    this.randseed[3] =
      this.randseed[3] ^ (this.randseed[3] >> 19) ^ t ^ (t >> 8);

    return (this.randseed[3] >>> 0) / ((1 << 31) >>> 0);
  }

  createColor() {
    //saturation is the whole color spectrum
    const h = Math.floor(this.rand() * 360);
    //saturation goes from 40 to 100, it avoids greyish colors
    const s = Math.round(this.rand() * 600) / 10 + 40 + "%";
    //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
    const l =
      Math.round(
        (this.rand() + this.rand() + this.rand() + this.rand()) * 250,
      ) /
        10 +
      "%";

    return "hsl(" + h + "," + s + "," + l + ")";
  }

  createImageData() {
    const width = this.size;
    const height = this.size;

    const dataWidth = Math.ceil(width / 2);
    const mirrorWidth = width - dataWidth;

    const data = [];
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < dataWidth; x++) {
        // this makes foreground and background color to have a 43% (1/2.3) probability
        // spot color has 13% chance
        row[x] = Math.floor(this.rand() * 2.3);
      }
      const r = row.slice(0, mirrorWidth);
      r.reverse();
      row = row.concat(r);

      for (let i = 0; i < row.length; i++) {
        data.push(row[i]);
      }
    }

    return data;
  }

  pickColor(value: number) {
    return value === 1
      ? this.color
      : value === 2
      ? this.spotColor
      : this.bgColor;
  }
}

interface BlockieAvatarProps {
  seed: string;
  className?: string;
}

export function BlockieAvatar({ className, seed }: BlockieAvatarProps) {
  const blockie = new Blockie(seed);
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <symbol id={`${seed}-half`}>
          {blockie.createImageData().map((cur, idx) => {
            const x = idx % 8;
            if (x >= 4 || cur === 0) return null;

            return (
              <rect
                key={idx}
                x={x}
                y={Math.floor(idx / 8)}
                width="1"
                height="1"
                fill={blockie.pickColor(cur)}
              />
            );
          })}
        </symbol>
      </defs>
      <rect x="0" y="0" width="8" height="8" fill={blockie.bgColor} />
      <use xlinkHref={`#${seed}-half`} x="0" y="0" />
      <use
        xlinkHref={`#${seed}-half`}
        x="0"
        y="0"
        transform="scale(-1, 1) translate(-8, 0)"
      />
    </svg>
  );
}
