# Gauge Speed Meter

A lightweight and customizable React component to display a speed meter, such as an internet speed meter. The package provides a user-friendly interface and allows customization of the meter's appearance.

## Screenshot

![Gauge Speed Meter Screenshot](./src/assets/image.png)

## Installation

You can install the package using npm, yarn, or pnpm:

### Using npm:
```bash
npm i gauge-speed-meter
```

### Using yarn:
```bash
yarn add gauge-speed-meter
```

### Using pnpm:
```bash
pnpm add gauge-speed-meter
```

## Usage

Import the `GaugeSpeedMeter` component and use it in your React application. Below is an example of how to display an internet speed meter:

```jsx
import React from 'react';
import GaugeSpeedMeter from 'gauge-speed-meter';

const App = () => {
  return (
    <div>
      <h1>Internet Speed Meter</h1>
      <GaugeSpeedMeter 
        internetSpeed={10} 
        status={true} 
        arcColor="#e1eb88" 
      />
    </div>
  );
};

export default App;
```

### Props

| Prop           | Type    | Description                                        |
|----------------|---------|----------------------------------------------------|
| `internetSpeed`| Number  | The speed value to display in the gauge (e.g., Mbps). |
| `status`       | Boolean | The status indicating whether the meter is active. |
| `arcColor`     | String  | The color of the arc in the gauge (Hex/RGB value). |

## Features

- Fully customizable speed meter.
- Supports different color schemes.
- Simple and lightweight.


## License

This project is licensed under the [MIT License](LICENSE).
