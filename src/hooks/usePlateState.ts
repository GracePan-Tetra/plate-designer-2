import { useReducer } from 'react';
import { PlateFormat, WellMap, ViewMode, WellKey } from '../types';
import { mockConditions } from '../data/mockConditions';
import { autoFill } from '../utils/serpentine';

interface PlateState {
  plateFormat: PlateFormat;
  selectedConditionIds: string[];
  wellMap: WellMap;
  manualMode: boolean;
  viewMode: ViewMode;
  groupByColumn: string;
  hoveredConditionId: string | null;
  page: number;
  filter: string;
}

type PlateAction =
  | { type: 'SET_PLATE_FORMAT'; payload: PlateFormat }
  | { type: 'TOGGLE_CONDITION_SELECTION'; payload: string }
  | { type: 'SELECT_ALL_CONDITIONS' }
  | { type: 'DESELECT_ALL_CONDITIONS' }
  | { type: 'TOGGLE_MANUAL_MODE' }
  | { type: 'PAINT_WELL'; payload: WellKey }
  | { type: 'AUTO_FILL' }
  | { type: 'CLEAR_WELLS' }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_GROUP_BY_COLUMN'; payload: string }
  | { type: 'SET_HOVERED_CONDITION'; payload: string | null }
  | { type: 'REMOVE_CONDITION'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_FILTER'; payload: string };

const initialState: PlateState = {
  plateFormat: '96',
  selectedConditionIds: [],
  wellMap: {},
  manualMode: false,
  viewMode: 'unique',
  groupByColumn: 'factor1',
  hoveredConditionId: null,
  page: 0,
  filter: '',
};

function plateReducer(state: PlateState, action: PlateAction): PlateState {
  switch (action.type) {
    case 'SET_PLATE_FORMAT':
      return { ...state, plateFormat: action.payload, wellMap: {} };

    case 'TOGGLE_CONDITION_SELECTION': {
      const id = action.payload;
      const isSelected = state.selectedConditionIds.includes(id);
      return {
        ...state,
        selectedConditionIds: isSelected
          ? state.selectedConditionIds.filter((c) => c !== id)
          : [...state.selectedConditionIds, id],
      };
    }

    case 'SELECT_ALL_CONDITIONS':
      return {
        ...state,
        selectedConditionIds: mockConditions.map((c) => c.id),
      };

    case 'DESELECT_ALL_CONDITIONS':
      return { ...state, selectedConditionIds: [] };

    case 'TOGGLE_MANUAL_MODE':
      return { ...state, manualMode: !state.manualMode };

    case 'PAINT_WELL': {
      if (!state.manualMode) return state;
      const wellKey = action.payload;
      const firstSelectedId = state.selectedConditionIds[0];
      if (!firstSelectedId) return state;

      const existing = state.wellMap[wellKey];
      if (existing && existing.conditionId === firstSelectedId) {
        // Toggle off
        const newMap = { ...state.wellMap };
        delete newMap[wellKey];
        return { ...state, wellMap: newMap };
      }

      const condition = mockConditions.find((c) => c.id === firstSelectedId);
      if (!condition) return state;

      return {
        ...state,
        wellMap: {
          ...state.wellMap,
          [wellKey]: { conditionId: firstSelectedId, color: condition.color },
        },
      };
    }

    case 'AUTO_FILL': {
      const selectedConditions = state.selectedConditionIds
        .map((id) => mockConditions.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => c !== undefined);

      return {
        ...state,
        wellMap: autoFill(state.plateFormat, selectedConditions),
      };
    }

    case 'CLEAR_WELLS':
      return { ...state, wellMap: {} };

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };

    case 'SET_GROUP_BY_COLUMN':
      return { ...state, groupByColumn: action.payload };

    case 'SET_HOVERED_CONDITION':
      return { ...state, hoveredConditionId: action.payload };

    case 'REMOVE_CONDITION': {
      const id = action.payload;
      const newWellMap = { ...state.wellMap };
      Object.entries(newWellMap).forEach(([key, val]) => {
        if (val.conditionId === id) delete newWellMap[key];
      });
      return {
        ...state,
        selectedConditionIds: state.selectedConditionIds.filter((c) => c !== id),
        wellMap: newWellMap,
      };
    }

    case 'SET_PAGE':
      return { ...state, page: action.payload };

    case 'SET_FILTER':
      return { ...state, filter: action.payload, page: 0 };

    default:
      return state;
  }
}

export function usePlateState() {
  const [state, dispatch] = useReducer(plateReducer, initialState);
  return { state, dispatch };
}
