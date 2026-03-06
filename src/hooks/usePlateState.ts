import { useReducer } from 'react';
import { PlateFormat, WellMap, ViewMode, WellKey } from '../types';
import { mockConditions } from '../data/mockConditions';
import { autoFill, uiToWellKey } from '../utils/serpentine';

interface PlateState {
  plateFormat: PlateFormat;
  selectedConditionIds: string[];
  wellMap: WellMap;
  viewMode: ViewMode;
  groupByColumn: string;
  hoveredConditionId: string | null;
  page: number;
  // Mapping settings
  fillStrategy: 'snake';
  startWell: string;   // UI format e.g. "A1"
  replicates: number;
}

type PlateAction =
  | { type: 'SET_PLATE_FORMAT'; payload: PlateFormat }
  | { type: 'TOGGLE_CONDITION_SELECTION'; payload: string }
  | { type: 'SELECT_ALL_CONDITIONS' }
  | { type: 'DESELECT_ALL_CONDITIONS' }
  | { type: 'PAINT_WELL'; payload: WellKey }
  | { type: 'ASSIGN_CONDITION_TO_WELL'; payload: { wellKey: string; conditionId: string } }
  | { type: 'APPLY_MAPPING' }
  | { type: 'CLEAR_WELLS' }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_GROUP_BY_COLUMN'; payload: string }
  | { type: 'SET_HOVERED_CONDITION'; payload: string | null }
  | { type: 'REMOVE_CONDITION'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_FILL_STRATEGY'; payload: 'snake' }
  | { type: 'SET_START_WELL'; payload: string }
  | { type: 'SET_REPLICATES'; payload: number };

const initialState: PlateState = {
  plateFormat: '96',
  selectedConditionIds: [],
  wellMap: {},
  viewMode: 'unique',
  groupByColumn: 'load_challenge',
  hoveredConditionId: null,
  page: 0,
  fillStrategy: 'snake',
  startWell: 'A1',
  replicates: 3,
};

function plateReducer(state: PlateState, action: PlateAction): PlateState {
  switch (action.type) {
    case 'SET_PLATE_FORMAT':
      return { ...state, plateFormat: action.payload, wellMap: {}, startWell: 'A1' };

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
      return { ...state, selectedConditionIds: mockConditions.map((c) => c.id) };

    case 'DESELECT_ALL_CONDITIONS':
      return { ...state, selectedConditionIds: [] };

    case 'PAINT_WELL': {
      const wellKey = action.payload;
      const firstSelectedId = state.selectedConditionIds[0];
      if (!firstSelectedId) return state;

      const existing = state.wellMap[wellKey];
      if (existing && existing.conditionId === firstSelectedId) {
        const newMap = { ...state.wellMap };
        delete newMap[wellKey];
        return { ...state, wellMap: newMap };
      }

      const condition = mockConditions.find((c) => c.id === firstSelectedId);
      if (!condition) return state;

      return {
        ...state,
        wellMap: { ...state.wellMap, [wellKey]: { conditionId: firstSelectedId, color: condition.color } },
      };
    }

    case 'APPLY_MAPPING': {
      const selectedConditions = state.selectedConditionIds
        .map((id) => mockConditions.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => c !== undefined);

      return {
        ...state,
        wellMap: autoFill(
          state.plateFormat,
          selectedConditions,
          uiToWellKey(state.startWell),
          state.replicates,
        ),
      };
    }

    case 'ASSIGN_CONDITION_TO_WELL': {
      const { wellKey, conditionId } = action.payload;
      const condition = mockConditions.find((c) => c.id === conditionId);
      if (!condition) return state;
      return { ...state, wellMap: { ...state.wellMap, [wellKey]: { conditionId, color: condition.color } } };
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

    case 'SET_FILL_STRATEGY':
      return { ...state, fillStrategy: action.payload };

    case 'SET_START_WELL':
      return { ...state, startWell: action.payload };

    case 'SET_REPLICATES':
      return { ...state, replicates: action.payload };

    default:
      return state;
  }
}

export function usePlateState() {
  const [state, dispatch] = useReducer(plateReducer, initialState);
  return { state, dispatch };
}
