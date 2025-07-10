import React, { useState, useRef } from 'react';
import { Save, Download, Plus, Trash2, MapPin, AlertTriangle, Car, Truck, Users, Clock, FileText, Settings } from 'lucide-react';

const TrafficManagementPlanner = () => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [currentTab, setCurrentTab] = useState('overview');
  const canvasRef = useRef(null);

  // Traffic control elements
  const trafficElements = [
    { id: 'cone', name: 'Traffic Cone', icon: '🚧', color: '#FF6B35' },
    { id: 'sign', name: 'Warning Sign', icon: '⚠️', color: '#FFD23F' },
    { id: 'barrier', name: 'Barrier', icon: '🚧', color: '#EE6C4D' },
    { id: 'light', name: 'Traffic Light', icon: '🚦', color: '#3A86FF' },
    { id: 'flag', name: 'Flagging Station', icon: '🚩', color: '#06FFA5' },
    { id: 'detour', name: 'Detour Sign', icon: '↗️', color: '#8338EC' }
  ];

  const createNewProject = () => {
    const newProject = {
      id: Date.now(),
      name: `Project ${projects.length + 1}`,
      location: '',
      workType: 'Road Maintenance',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      trafficVolume: 'Medium',
      elements: [],
      phases: [],
      notes: '',
      createdAt: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
    setActiveProject(newProject);
  };

  const updateProject = (updates) => {
    const updatedProject = { ...activeProject, ...updates };
    setActiveProject(updatedProject);
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const addTrafficElement = (elementType, x = 100, y = 100) => {
    const newElement = {
      id: Date.now(),
      type: elementType,
      x,
      y,
      rotation: 0,
      notes: ''
    };
    updateProject({
      elements: [...(activeProject?.elements || []), newElement]
    });
  };

  const addPhase = () => {
    const newPhase = {
      id: Date.now(),
      name: `Phase ${(activeProject?.phases || []).length + 1}`,
      description: '',
      duration: '',
      trafficImpact: 'Low',
      requirements: []
    };
    updateProject({
      phases: [...(activeProject?.phases || []), newPhase]
    });
  };

  const exportPlan = () => {
    if (!activeProject) return;
    
    const planData = {
      projectInfo: {
        name: activeProject.name,
        location: activeProject.location,
        workType: activeProject.workType,
        dates: `${activeProject.startDate} to ${activeProject.endDate}`,
        trafficVolume: activeProject.trafficVolume
      },
      phases: activeProject.phases,
      elements: activeProject.elements,
      notes: activeProject.notes,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(planData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.name}_traffic_plan.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ProjectOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Settings className="mr-2 text-blue-600" />
          Project Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input
              type="text"
              value={activeProject?.name || ''}
              onChange={(e) => updateProject({ name: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={activeProject?.location || ''}
              onChange={(e) => updateProject({ location: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Street address or intersection"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Work Type</label>
              <select
                value={activeProject?.workType || ''}
                onChange={(e) => updateProject({ workType: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="Road Maintenance">Road Maintenance</option>
                <option value="Utility Work">Utility Work</option>
                <option value="Construction">Construction</option>
                <option value="Emergency Repair">Emergency Repair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Traffic Volume</label>
              <select
                value={activeProject?.trafficVolume || ''}
                onChange={(e) => updateProject({ trafficVolume: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low (&lt;1000 vehicles/day)</option>
                <option value="Medium">Medium (1000-5000 vehicles/day)</option>
                <option value="High">High (&gt;5000 vehicles/day)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={activeProject?.startDate || ''}
                onChange={(e) => updateProject({ startDate: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={activeProject?.endDate || ''}
                onChange={(e) => updateProject({ endDate: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-yellow-600" />
          Safety Requirements
        </h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="text-red-600 mr-2" size={20} />
            <span className="text-sm">High-visibility clothing required</span>
          </div>
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
            <Car className="text-yellow-600 mr-2" size={20} />
            <span className="text-sm">Flagging personnel needed</span>
          </div>
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <Clock className="text-blue-600 mr-2" size={20} />
            <span className="text-sm">Work zone speed limit: 25 mph</span>
          </div>
        </div>
      </div>
    </div>
  );

  const PhasesTab = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Project Phases</h3>
        <button
          onClick={addPhase}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <Plus className="mr-2" size={16} />
          Add Phase
        </button>
      </div>
      <div className="space-y-4">
        {(activeProject?.phases || []).map((phase, index) => (
          <div key={phase.id} className="border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phase Name</label>
                <input
                  type="text"
                  value={phase.name}
                  onChange={(e) => {
                    const updatedPhases = [...(activeProject?.phases || [])];
                    updatedPhases[index] = { ...phase, name: e.target.value };
                    updateProject({ phases: updatedPhases });
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  value={phase.duration}
                  onChange={(e) => {
                    const updatedPhases = [...(activeProject?.phases || [])];
                    updatedPhases[index] = { ...phase, duration: e.target.value };
                    updateProject({ phases: updatedPhases });
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2 days, 1 week"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Traffic Impact</label>
                <select
                  value={phase.trafficImpact}
                  onChange={(e) => {
                    const updatedPhases = [...(activeProject?.phases || [])];
                    updatedPhases[index] = { ...phase, trafficImpact: e.target.value };
                    updateProject({ phases: updatedPhases });
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={phase.description}
                onChange={(e) => {
                  const updatedPhases = [...(activeProject?.phases || [])];
                  updatedPhases[index] = { ...phase, description: e.target.value };
                  updateProject({ phases: updatedPhases });
                }}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Describe the work activities and traffic control measures"
              />
            </div>
          </div>
        ))}
        {(activeProject?.phases || []).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No phases added yet. Click "Add Phase" to start planning.</p>
          </div>
        )}
      </div>
    </div>
  );

  const DiagramTab = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Traffic Control Diagram</h3>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Save Diagram
          </button>
        </div>
      </div>
      
      <div className="flex">
        <div className="w-64 border-r pr-4">
          <h4 className="font-semibold mb-3">Traffic Elements</h4>
          <div className="space-y-2">
            {trafficElements.map((element) => (
              <button
                key={element.id}
                onClick={() => addTrafficElement(element.id)}
                className="w-full p-3 text-left border rounded hover:bg-gray-50 flex items-center"
              >
                <span className="mr-3 text-lg">{element.icon}</span>
                <span className="text-sm">{element.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 ml-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 relative bg-gray-50">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Drag elements here to create your traffic control plan</p>
                <p className="text-sm mt-2">Click elements on the left to add them to the diagram</p>
              </div>
            </div>
            
            {(activeProject?.elements || []).map((element) => {
              const elementDef = trafficElements.find(e => e.id === element.type);
              return (
                <div
                  key={element.id}
                  className="absolute cursor-move bg-white border-2 rounded p-2 shadow-md"
                  style={{
                    left: element.x,
                    top: element.y,
                    borderColor: elementDef?.color || '#ccc'
                  }}
                >
                  <span className="text-lg">{elementDef?.icon}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (!activeProject) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Traffic Management Plan Designer</h1>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <FileText size={64} className="mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-600 mb-6">Create your first traffic management plan for civil infrastructure work sites.</p>
            <button
              onClick={createNewProject}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
            >
              <Plus className="mr-2" size={20} />
              Create New Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Traffic Management Planner</h1>
        <div className="flex space-x-3">
          <button
            onClick={createNewProject}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <Plus className="mr-2" size={16} />
            New Project
          </button>
          <button
            onClick={exportPlan}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <Download className="mr-2" size={16} />
            Export Plan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">{activeProject.name}</h2>
          <p className="text-gray-600">{activeProject.location}</p>
        </div>
        
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'phases', label: 'Phases', icon: Clock },
            { id: 'diagram', label: 'Diagram', icon: MapPin }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-6 py-3 font-medium flex items-center ${
                currentTab === tab.id 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="mr-2" size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        {currentTab === 'overview' && <ProjectOverview />}
        {currentTab === 'phases' && <PhasesTab />}
        {currentTab === 'diagram' && <DiagramTab />}
      </div>
    </div>
  );
};

export default TrafficManagementPlanner;