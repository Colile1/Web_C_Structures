import { observer } from 'mobx-react-lite';
import { forceStore } from '../stores/forceStore';

export const ForceLegend = observer(() => {
  const { minForce, maxForce } = forceStore;

  return (
    <div className="fixed right-4 bottom-4 bg-white p-4 rounded-lg shadow-xl">
      <div className="flex items-center mb-2">
        <div className="w-8 h-4 mr-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
        <span className="text-sm">{minForce.toFixed(2)} N (Tension)</span>
      </div>
      <div className="flex items-center">
        <div className="w-8 h-4 mr-2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
        <span className="text-sm">{maxForce.toFixed(2)} N (Compression)</span>
      </div>
    </div>
  );
});
