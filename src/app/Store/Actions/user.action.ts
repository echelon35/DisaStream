import { createAction, props } from '@ngrx/store';
import { User } from '../../Model/User';

// Charger l'utilisateur (par exemple, après connexion ou depuis un backend)
export const loginUser = createAction(
  '[User] Login',
  props<{ user: User }>()
);

// Déconnecter l'utilisateur
export const logoutUser = createAction('[User] Logout');
