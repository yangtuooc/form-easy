import React from "react";

export interface ControlPanelPlugin {
  component: React.ComponentType<any>;
  props: any;
}

interface ControlPanelProps {
  plugins: ControlPanelPlugin[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({ plugins }) => {
  return (
    <div className="space-y-4 p-4">
      {plugins.map((plugin, index) => (
        <React.Fragment key={index}>
          <plugin.component {...plugin.props} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ControlPanel;
