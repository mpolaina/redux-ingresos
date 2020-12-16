import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';
import * as ing from './ingreso/ingreso-gasto.reducer';


export interface AppState {
   ui: ui.State // carga el isloading: boolean
   user: auth.State,
   ingresosGastos: ing.State
}


export const appReducers: ActionReducerMap<AppState> = {
  // state: action
   ui: ui.uiReducer,
   user: auth.authReducer,
   ingresosGastos: ing.ingresoGastoReducer

}
