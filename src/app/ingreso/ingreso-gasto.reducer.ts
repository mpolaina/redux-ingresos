import { createReducer, on } from '@ngrx/store';
import { IngresoGasto } from '../models/ingresos.model';
import { setItems, unSetItems } from './ingreso-gasto.actions';

export interface State {
    items: IngresoGasto[];
}

export const initialState: State = {
   items: [],
}

const _ingresoGastoReducer = createReducer(initialState,

    on( setItems, (state, { items }) => ({ ...state, items: [...items] }) ),
    on( unSetItems, state => ({ ...state, items: [] }) ),

);

export function ingresoGastoReducer(state, action) {
    return _ingresoGastoReducer(state, action);
}
