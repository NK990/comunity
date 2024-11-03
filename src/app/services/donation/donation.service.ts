import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  endDate: Date;
  mosque?: string;
}

export interface ZakatCalculation {
  savings: number;
  gold: number;
  silver: number;
  stocks: number;
  realEstate: number;
  business: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private campaigns = new BehaviorSubject<Campaign[]>([
    {
      id: '1',
      title: 'Mosque Renovation Fund',
      description: 'Help us renovate our community mosque to accommodate more worshippers.',
      goal: 50000,
      raised: 15000,
      endDate: new Date('2024-12-31'),
      mosque: 'Central Mosque'
    },
    {
      id: '2',
      title: 'Ramadan Food Drive',
      description: 'Provide iftar meals for families in need during Ramadan.',
      goal: 10000,
      raised: 3500,
      endDate: new Date('2024-03-10'),
      mosque: 'Islamic Center'
    }
  ]);

  private readonly NISAB_GOLD = 87.48; // grams
  private readonly GOLD_PRICE = 65; // USD per gram (approximate)
  private readonly ZAKAT_RATE = 0.025; // 2.5%

  constructor() {}

  getCampaigns(): Observable<Campaign[]> {
    return this.campaigns.asObservable();
  }

  calculateZakat(assets: Partial<ZakatCalculation>): ZakatCalculation {
    const calculation: ZakatCalculation = {
      savings: assets.savings || 0,
      gold: assets.gold || 0,
      silver: assets.silver || 0,
      stocks: assets.stocks || 0,
      realEstate: assets.realEstate || 0,
      business: assets.business || 0,
      total: 0
    };

    // Calculate total assets
    const totalAssets = Object.values(calculation).reduce((sum, value) => sum + value, 0);

    // Calculate Nisab threshold in current currency
    const nisabThreshold = this.NISAB_GOLD * this.GOLD_PRICE;

    // Calculate Zakat if total assets exceed Nisab
    calculation.total = totalAssets >= nisabThreshold ? totalAssets * this.ZAKAT_RATE : 0;

    return calculation;
  }

  async processDonation(campaignId: string, amount: number, paymentDetails: any): Promise<boolean> {
    // In a real app, this would integrate with a payment gateway
    // For now, we'll simulate a successful donation
    const updatedCampaigns = this.campaigns.value.map(campaign => {
      if (campaign.id === campaignId) {
        return {
          ...campaign,
          raised: campaign.raised + amount
        };
      }
      return campaign;
    });

    this.campaigns.next(updatedCampaigns);
    return true;
  }

  getNisabThreshold(): number {
    return this.NISAB_GOLD * this.GOLD_PRICE;
  }
}
