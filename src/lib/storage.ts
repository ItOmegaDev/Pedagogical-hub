import { Material, User } from '../types';
import {
  saveUserProfile,
  getUserProfile,
  subscribeToMaterials,
  publishMaterial,
  toggleLikeMaterial as toggleLikeFirestore,
  toggleSaveMaterial as toggleSaveFirestore,
  addCommentToMaterial as addCommentFirestore,
  addReplyToComment as addReplyFirestore,
  incrementViewCount as incrementViewFirestore,
  deleteMaterial as deleteMaterialFirestore
} from './firebase';

export {
  saveUserProfile,
  getUserProfile,
  subscribeToMaterials,
  publishMaterial,
  toggleLikeFirestore,
  toggleSaveFirestore,
  addCommentFirestore,
  addReplyFirestore,
  incrementViewFirestore,
  deleteMaterialFirestore
};
