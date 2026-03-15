import DirectoryProvider from "./DirectoryProvider.tsx";
import HeatmapApp from "./HeatmapApp.tsx";
import WasmProvider from "./WasmProvider.tsx";

function App() {
  return (
    <WasmProvider>
      <DirectoryProvider>
        <div className={"m-2"}>
          <h1>mca heatmap</h1>
        </div>
        <HeatmapApp></HeatmapApp>
      </DirectoryProvider>
    </WasmProvider>
  );
}

export default App;
