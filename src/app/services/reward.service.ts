import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reward } from '../models/reward'; // Asegúrate de importar la interfaz Reward

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private apiUrl = `${environment.apiUrl}/rewards`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los premios disponibles.
   * @returns Observable con la lista de premios.
   */
  getAllRewards(): Observable<Reward[]> {
    console.log('Fetching rewards from API:', this.apiUrl);
    return this.http.get<Reward[]>(this.apiUrl);
  }

  /**
   * Obtiene los detalles de un premio específico por su ID.
   * @param id - El ID del premio.
   * @returns Observable con los detalles del premio.
   */
  getRewardById(id: number): Observable<Reward> {
    return this.http.get<Reward>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo premio.
   * @param rewardData - Los datos del premio a crear.
   * @returns Observable con el premio creado.
   */
  createReward(rewardData: Reward): Observable<Reward> {
    return this.http.post<Reward>(this.apiUrl, rewardData);
  }

  /**
   * Actualiza un premio existente.
   * @param id - El ID del premio a actualizar.
   * @param rewardData - Los datos actualizados del premio.
   * @returns Observable con el premio actualizado.
   */
  updateReward(id: number, rewardData: Reward): Observable<Reward> {
    return this.http.put<Reward>(`${this.apiUrl}/${id}`, rewardData);
  }

  /**
   * Elimina un premio por su ID.
   * @param id - El ID del premio a eliminar.
   * @returns Observable con el resultado de la operación.
   */
  deleteReward(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene el total de premios canjeados.
   * @returns Observable con el total de premios canjeados.
   */
  getTotalRewardsRedeemed(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/total-redeemed`);
  }

  /**
   * Obtiene el total de puntos gastados en premios.
   * @returns Observable con el total de puntos gastados.
   */
  getTotalPointsSpent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/total-points-spent`);
  }

  /**
   * Obtiene los premios más populares.
   * @param limit - El número máximo de premios a obtener.
   * @returns Observable con la lista de premios más populares.
   */
  getMostPopularRewards(limit: number = 5): Observable<Reward[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Reward[]>(`${this.apiUrl}/most-popular`, { params });
  }

  /**
   * Canjea un premio para un usuario específico.
   * @param userId - El ID del usuario.
   * @param rewardId - El ID del premio a canjear.
   * @returns Observable con el resultado de la operación.
   */
  redeemReward(userId: number, rewardId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/redeem`, { user_id: userId, reward_id: rewardId });
  }
}
