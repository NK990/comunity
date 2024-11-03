import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DonationService, Campaign, ZakatCalculation } from '../../services/donation/donation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.page.html',
  styleUrls: ['./donation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class DonationPage implements OnInit {
  campaigns$: Observable<Campaign[]>;
  showZakatCalculator = false;
  showDonationModal = false;
  selectedCampaign: Campaign | null = null;
  donationAmount: number = 0;
  zakatAssets: Partial<ZakatCalculation> = {
    savings: 0,
    gold: 0,
    silver: 0,
    stocks: 0,
    realEstate: 0,
    business: 0
  };
  zakatResult: ZakatCalculation | null = null;
  nisabThreshold: number;

  constructor(private donationService: DonationService) {
    this.campaigns$ = this.donationService.getCampaigns();
    this.nisabThreshold = this.donationService.getNisabThreshold();
  }

  ngOnInit() {}

  calculateZakat() {
    this.zakatResult = this.donationService.calculateZakat(this.zakatAssets);
  }

  resetCalculator() {
    this.zakatAssets = {
      savings: 0,
      gold: 0,
      silver: 0,
      stocks: 0,
      realEstate: 0,
      business: 0
    };
    this.zakatResult = null;
  }

  openDonationModal(campaign: Campaign | null) {
    this.selectedCampaign = campaign;
    this.showDonationModal = true;
  }

  async processDonation() {
    if (this.selectedCampaign && this.donationAmount > 0) {
      const success = await this.donationService.processDonation(
        this.selectedCampaign.id,
        this.donationAmount,
        {} // Payment details would be added here in production
      );

      if (success) {
        this.showDonationModal = false;
        this.donationAmount = 0;
        this.selectedCampaign = null;
      }
    }
  }

  getProgressPercentage(campaign: Campaign): number {
    return (campaign.raised / campaign.goal) * 100;
  }

  getRemainingDays(endDate: Date): number {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
