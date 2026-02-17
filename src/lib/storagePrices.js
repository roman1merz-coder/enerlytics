/**
 * Storage system pricing data from German retailers
 * Prices in EUR, includes 0% MwSt where applicable (§12 Abs. 3 UStG)
 * Last updated: February 2026
 */

const storagePrices = {
  'byd-battery-box-premium-hvs': {
    msrp_eur: 3500,
    offers: [
      { shop: 'Geizhals', price: 3107, url: 'https://geizhals.de/byd-battery-box-premium-hvs-10-2-a2814466.html', note: 'Preisvergleich, ab' },
      { shop: 'mg-solar-shop', price: 3224, url: 'https://www.mg-solar-shop.de/BYD-B-Box-Premium-HVS-10.2-Batteriespeicher-10-24-kWh', note: '10.24 kWh' },
      { shop: 'Solarhandel24', price: 3290, url: 'https://solarhandel24.de/products/byd-hvs-10-2-battery-box-premium', note: 'Versand 99 EUR' },
      { shop: 'solarspeicher24', price: 3350, url: 'https://solarspeicher24.de/a/byd-premium-hvs-10.2-battery-box-10-24kwh-solarspeicher/9885700/', note: 'Schnelle Lieferung' },
      { shop: 'pro-akkus.de', price: 3390, url: 'https://www.pro-akkus.de/byd-battery-box-premium-hvs-10.2-10-24-kwh-solarspeicher/bydbbhvs10.2', note: 'Fachhandel' },
    ],
  },
  'sonnen-batterie-10': {
    msrp_eur: 9500,
    offers: [
      { shop: 'energiespeicher-online', price: 8990, url: 'https://www.energiespeicher-online.shop/Energiespeicher/Speicher-Typ/Hochvolt/sonnenbatterie-10-11-kwh', note: '11 kWh Variante' },
      { shop: 'energiespeicher-online', price: 7490, url: 'https://www.energiespeicher-online.shop/energiespeicher/sonnenbatterie-10-5-5-kwh', note: '5.5 kWh Variante' },
      { shop: 'sonnen.de (Direkt)', price: 9500, url: 'https://www.sonnen.de/stromspeicher/sonnenbatterie-10', note: 'Offiziell, Angebot via Fachpartner' },
      { shop: 'Secondsol', price: 6500, url: 'https://www.secondsol.com/de/anzeige/41335//sonnenbatterie/sonnenbatterie-10', note: 'Gebraucht / B-Ware' },
    ],
  },
  'e3dc-s10-e-pro': {
    msrp_eur: 19000,
    offers: [
      { shop: 'solartec-shop', price: 16500, url: 'https://solartec-shop.com/E3-DC-S10-E-PRO-COMPACT-Hauskraftwerk-24', note: 'S10 E PRO COMPACT' },
      { shop: 'energiespeicher-online', price: 17500, url: 'https://www.energiespeicher-online.shop/Energiespeicher/Speicher-Typ/3-phasig/e3-dc-s10-se-10', note: 'S10 SE Variante' },
      { shop: 'enerix (Partner)', price: 19000, url: 'https://www.enerix.de/hersteller/e3dc/e3dc-s10-e-pro-compact/', note: 'Installation inkl.' },
      { shop: 'Kleinanzeigen', price: 14000, url: 'https://www.kleinanzeigen.de/s-e3dc-s10/k0', note: 'Neu/Gebraucht' },
    ],
  },
  'tesla-powerwall-2': {
    msrp_eur: 9600,
    offers: [
      { shop: 'sonnenlichtenergie', price: 6290, url: 'https://www.sonnenlichtenergie.de/products/tesla-powerwall-2', note: 'Günstigster Preis' },
      { shop: 'Voltus', price: 7500, url: 'https://www.voltus.de/tesla-powerwall2ac-powerwall-2-1-phasig-13-5-kwh.html', note: '1-phasig, 13.5 kWh' },
      { shop: 'SBT Energie', price: 8200, url: 'https://sbt-energie.shop/products/3x-tesla-powerwall-2-backup-gateway-2', note: '3er Set verfügbar' },
      { shop: 'BatteriespeicherDE', price: 8500, url: 'https://batteriespeicherdeutschland.de/tesla-powerwall/', note: 'Zertifizierter Installateur' },
      { shop: 'Tesla.com', price: 9600, url: 'https://www.tesla.com/de_DE/powerwall', note: 'Offiziell + Gateway' },
    ],
  },
  'lg-resu-10h': {
    msrp_eur: 6800,
    offers: [
      { shop: 'eBay', price: 3299, url: 'https://www.ebay.de/shop/resu-lg?_nkw=resu+lg', note: 'Prime 10H, Preisvorschlag möglich' },
      { shop: 'Sonnenshop', price: 3850, url: 'https://www.sonnenshop.de/speichersysteme/lg-chem-resu-10h-prime', note: 'RESU 10H Prime' },
      { shop: 'Alma Solarshop', price: 4200, url: 'https://www.alma-solarshop.de/solarbatterien/1383-lg-chem-akku-resu-10h-prime-hochspannung.html', note: 'Hochspannung' },
      { shop: 'Panda Solar', price: 4500, url: 'https://www.panda-solar.de/lg-chem-resu-10-energiespeicher-139.html', note: 'inkl. 0% MwSt' },
      { shop: 'BayWa r.e.', price: 5200, url: 'https://solar-distribution.baywa-re.de/en/storage-parts/lg-chem-resu10h-for-solaredge.html', note: 'für SolarEdge' },
    ],
  },
  'senec-home-v3-hybrid': {
    msrp_eur: 10000,
    offers: [
      { shop: 'Mitzner Energie', price: 7500, url: 'https://mitzner-energie.de/storage-batterispeicher_402146.html', note: '7.5 kWh Duo' },
      { shop: 'Mitzner Energie', price: 8500, url: 'https://mitzner-energie.de/storage-batterispeicher_402143.html', note: '10.0 kWh' },
      { shop: 'SENEC.com (Direkt)', price: 10000, url: 'https://senec.com/de/produkte/senec-home/v3', note: 'Über Fachpartner' },
      { shop: 'Kleinanzeigen', price: 6800, url: 'https://www.kleinanzeigen.de/s-senec-v3/k0', note: 'Neu/Gebraucht' },
    ],
  },
  'fenecon-home': {
    msrp_eur: 11500,
    offers: [
      { shop: 'energiespeicher-online', price: 10341, url: 'https://www.energiespeicher-online.shop/Energiespeicher/Speicher-Typ/3-phasig/fenecon-home-20-19.6', note: 'Home 20, 19.6 kWh' },
      { shop: 'aceflex.de', price: 10800, url: 'https://www.aceflex.de/magazin/fenecon-home-20-preis-wie-teuer-ist/', note: 'Info + Angebot' },
      { shop: 'photovoltaikshop.eu', price: 11495, url: 'https://www.photovoltaikshop.eu/en/fenecon', note: 'Komplettsystem' },
      { shop: 'photovoltaik-shop', price: 11200, url: 'https://www.photovoltaik-shop.com/stromspeicher/hersteller/fenecon.html', note: 'Verschiedene Modelle' },
    ],
  },
  'huawei-luna2000': {
    msrp_eur: 4500,
    offers: [
      { shop: 'Geizhals', price: 3390, url: 'https://geizhals.de/huawei-luna2000-10-s0-a2814677.html', note: 'Preisvergleich, ab' },
      { shop: 'billiger.de', price: 3712, url: 'https://www.billiger.de/products/4184920736-huawei-luna2000-10-s0', note: '26 Angebote' },
      { shop: 'guenstiger.de', price: 3760, url: 'https://www.guenstiger.de/Produkt/Huawei/LUNA2000_10_S0_10_kWh.html', note: '37 Angebote' },
      { shop: 'Volt-On Shop', price: 4195, url: 'https://shop.volt-on.de/Huawei-LUNA2000-10-S0-10-kWh', note: '10 kWh Paket' },
      { shop: 'mg-solar-shop', price: 4100, url: 'https://www.mg-solar-shop.de/Huawei-LUNA2000-10-S0-Batteriespeicher-10-kWh', note: '10 kWh' },
    ],
  },
  'solarwatt-battery-flex-ac': {
    msrp_eur: 8700,
    offers: [
      { shop: 'Deutschland PV', price: 8700, url: 'https://deutschland-pv.de/products/solarwatt', note: '9.6 kWh nutzbar, 0% MwSt' },
      { shop: 'PV Solartechnik', price: 8500, url: 'https://www.pv-solartechnik.de/shop/photovoltaik/batteriespeicher-und-batteriemanager-z.b-nachruestung-bestehender-anlagen/846/solarwatt-battery-flex-ac-1-1.3-9-6-kwh-nutzbar', note: 'AC-1 1.3' },
      { shop: 'solarwatt.com (Direkt)', price: 8700, url: 'https://www.solarwatt.com/solutions/our-products/product-overview/battery', note: 'Offiziell' },
    ],
  },
  'pylontech-us5000': {
    msrp_eur: 950,
    offers: [
      { shop: 'Geizhals', price: 748, url: 'https://geizhals.de/pylontech-us5000-v140425.html', note: 'Preisvergleich, ab' },
      { shop: 'Offgridtec', price: 769, url: 'https://www.offgridtec.com/pylontech-us5000-4-8kwh-lifepo4-batterie.html', note: '4.8 kWh LFP' },
      { shop: 'autobatterienbilliger', price: 885, url: 'https://www.autobatterienbilliger.de/Pylontech-US5000-4800Wh-48V-Batteriespeicher-Modul-fuer-Solaranlagen-umsatzsteuerbefreit', note: 'Bundle m. Zubehör' },
      { shop: 'greinSOLAR', price: 820, url: 'https://www.greinsolar.de/alle_anzeigen/energiespeicher/pylontech-us5000.aspx', note: 'PV-Shop' },
      { shop: 'Reichelt', price: 850, url: 'https://www.reichelt.com/de/en/shop/product/pylontech_us5000_4_8_kwh_lifepo4_48v-331976', note: 'Elektronik-Fachhandel' },
    ],
  },
  'kostal-piko-iq-55': {
    msrp_eur: 1900,
    offers: [
      { shop: 'Geizhals', price: 1747, url: 'https://geizhals.de/kostal-piko-iq-5-5-10335951-a2792242.html', note: 'Wechselrichter, ab' },
      { shop: 'solar-pur.de', price: 1790, url: 'https://shop.solar-pur.de/kostal-piko-iq-5-5-solar-wechselrichter-piko-iq5-5.html', note: 'Fachhandel' },
      { shop: 'Photovoltaik4all', price: 1850, url: 'https://www.photovoltaik4all.de/wechselrichter/kostal-piko-iq-5-5', note: 'PV-Wechselrichter' },
      { shop: 'elektro-wandelt', price: 1680, url: 'https://www.elektro-wandelt.de/KOSTAL-SolarElectric-PIKO-IQ-5-5-Wechselrichter.html', note: 'bis 40% Rabatt' },
    ],
  },
  'sma-sunny-boy-storage-5': {
    msrp_eur: 2100,
    offers: [
      { shop: 'Energiezentrale', price: 1000, url: 'https://energiezentrale.shop/products/sma-sunny-boy-storage-5-0', note: 'Angebot statt 1.996 EUR' },
      { shop: 'Sonnenshop', price: 1799, url: 'https://www.sonnenshop.de/wechselrichter/sma-sunny-boy-storage-5.0', note: 'Batteriewechselrichter' },
      { shop: 'Photovoltaik4all', price: 1850, url: 'https://www.photovoltaik4all.de/speicherwechselrichter/sma-sunny-boy-storage-5-0', note: 'Speicherwechselrichter' },
      { shop: 'Solarfy', price: 1900, url: 'https://www.solarfy.de/SMA-Sunny-Boy-Storage-50', note: 'SBS5.0-10' },
      { shop: 'mg-solar-shop', price: 1950, url: 'https://www.mg-solar-shop.de/Batteriespeichersysteme/Wechselrichter-und-Batteriemanager/SMA-Batteriewechselrichter/SMA-Sunny-Boy-Storage-SBS-5-0-10-Speicher-Wechselrichter.html', note: 'SBS 5.0-10' },
    ],
  },
  'fronius-solar-battery': {
    msrp_eur: 8700,
    offers: [
      { shop: 'Sonnenshop', price: 6455, url: 'https://www.sonnenshop.de/speichersysteme/fronius/fronius-battery-6,0-kwh', note: '6.0 kWh' },
      { shop: 'Sonnenshop', price: 8689, url: 'https://www.sonnenshop.de/speichersysteme/fronius/fronius-battery-10,5-kwh', note: '10.5 kWh' },
      { shop: 'Sonnenshop', price: 9708, url: 'https://www.sonnenshop.de/speichersysteme/fronius/fronius-battery-12,0-kwh', note: '12.0 kWh' },
      { shop: 'Europe Solar Store', price: 5890, url: 'https://www.europe-solarstore.com/fronius-solar-battery-6-0.html', note: '6.0 kWh' },
    ],
  },
  'goodwe-lynx-home-f': {
    msrp_eur: 3500,
    offers: [
      { shop: 'Geizhals', price: 1194, url: 'https://geizhals.de/goodwe-lynx-home-f-serie-v133293.html', note: 'Preisvergleich, ab' },
      { shop: 'Energiezentrale', price: 2795, url: 'https://energiezentrale.shop/collections/goodwe-speicher', note: 'LX F6.6-H, 6.6 kWh' },
      { shop: 'Energiezentrale', price: 3795, url: 'https://energiezentrale.shop/collections/goodwe-speicher', note: 'LX F9.8-H, 9.8 kWh' },
      { shop: 'Selfio', price: 2900, url: 'https://www.selfio.de/produkte/goodwe-power-control-unit-lynx-home-f-plus-plus-pcu-und-base', note: 'PCU + Base' },
      { shop: 'Soltech Shop', price: 2650, url: 'https://soltechshop.de/de_DE/p/GoodWe-Lynx-Home-F-Plus-PCU-mit-einer-Basis-Steuermodul/1727', note: 'Plus+ PCU' },
    ],
  },
  'varta-pulse-neo': {
    msrp_eur: 4300,
    offers: [
      { shop: 'Geizhals', price: 3269, url: 'https://geizhals.de/varta-pulse-neo-6-02707-858-312-a2814306.html', note: 'Preisvergleich, ab' },
      { shop: 'billiger.de', price: 3606, url: 'https://www.billiger.de/products/4459586597-varta-pulse-neo-6-batteriespeicher-6-5-kwh', note: '9 Angebote' },
      { shop: 'Energiezentrale', price: 4095, url: 'https://energiezentrale.shop/products/varta-pulse-neo-6', note: 'Angebot statt 4.295 EUR' },
      { shop: 'Volt-On Shop', price: 4007, url: 'https://shop.volt-on.de/Varta-Pulse-NEO-6', note: '6.5 kWh' },
      { shop: 'Photovoltaik-Shop', price: 3800, url: 'https://www.photovoltaik-shop.com/energiespeicher-varta-pulse-neo-6.html', note: 'DE/AT/CH' },
    ],
  },
  'rct-power-storage-dc': {
    msrp_eur: 6200,
    offers: [
      { shop: 'dp-solar-shop', price: 4008, url: 'https://www.dp-solar-shop.de/RCT-Power-Storage-DC-100-mit-Battery-115-Set', note: 'Battery 11.5 allein' },
      { shop: 'dp-solar-shop', price: 5592, url: 'https://www.dp-solar-shop.de/RCT-Power-Storage-DC-100-mit-Battery-96-Set', note: 'DC 10.0 + Battery 9.6' },
      { shop: 'dp-solar-shop', price: 6157, url: 'https://www.dp-solar-shop.de/RCT-Power-Storage-DC-100', note: 'DC 8.0 + Battery 11.5 Set' },
      { shop: 'photovoltaik-shop', price: 5800, url: 'https://www.photovoltaik-shop.com/hybridwechselrichter-rct-power-storage-dc-10-0.html', note: 'DC 10.0 Hybrid' },
      { shop: 'Secondsol', price: 4500, url: 'https://www.secondsol.com/de/anzeige/44584/wechselrichter/speicher/rct-power/rct-power-storage-dc-6-0', note: '0% MwSt, Gratis-Versand' },
    ],
  },
  'solaredge-energy-bank': {
    msrp_eur: 7200,
    offers: [
      { shop: 'Sauerländer Solarmarkt', price: 6500, url: 'https://sauerlaender-solarmarkt.de/Speicher/SolarEdge/', note: '0% MwSt' },
      { shop: 'Europe Solar Store', price: 6800, url: 'https://www.europe-solarstore.com/solaredge-energy-bank-10kwh-battery.html', note: '10 kWh' },
      { shop: 'nic-e Shop', price: 6900, url: 'https://www.nic-e.shop/en/solaredge/', note: 'SolarEdge Speicher' },
    ],
  },
  'alphaess-smile-g3': {
    msrp_eur: 5200,
    offers: [
      { shop: 'Energiezentrale', price: 1595, url: 'https://energiezentrale.shop/collections/alpha-ess', note: 'BAT-3.8S Modul' },
      { shop: 'Energiezentrale', price: 3595, url: 'https://energiezentrale.shop/collections/alpha-ess', note: 'BAT-8.2P Modul' },
      { shop: 'energiespeicher-online', price: 4800, url: 'https://www.energiespeicher-online.shop/Energiespeicher/Speicher-Typ/3-phasig/set-alphaess-smile-g3-t10-10-95-kwh-speicher', note: 'G3-T10 Set 10.95 kWh' },
      { shop: 'Sollis', price: 4500, url: 'https://sollis.de/produkt/set-alpha-smile-g3-t8-smile-g3-bat-3-8s/', note: 'G3-T8 Set' },
    ],
  },
  'sonnen-eco-9': {
    msrp_eur: 8500,
    offers: [
      { shop: 'energiespeicher-online', price: 7200, url: 'https://www.energiespeicher-online.shop/detail/1f5a79170c9a494d85a1a2f33375f736', note: 'eco 9, Performance' },
      { shop: 'sonnen.de (Direkt)', price: 8500, url: 'https://www.sonnen.de/stromspeicher/sonnenbatterie-10', note: 'Über Fachpartner' },
      { shop: 'Secondsol', price: 5500, url: 'https://www.secondsol.com/de/anzeige/41335//sonnenbatterie/sonnenbatterie-10', note: 'Gebraucht verfügbar' },
    ],
  },
  'viessmann-vitocharge-vx3': {
    msrp_eur: 5200,
    offers: [
      { shop: 'Geizhals', price: 2100, url: 'https://geizhals.de/viessmann-vitocharge-vx3-4-6a-v139967.html', note: '4.6A Basis, ab' },
      { shop: 'badexo.de', price: 3004, url: 'https://www.badexo.de/heizung/stromspeichersysteme/vitocharge-vx3', note: 'Typ 4.6A0' },
      { shop: 'Geizhals', price: 3526, url: 'https://geizhals.de/viessmann-vitocharge-vx3-6-0a-v139978.html', note: '6.0A Variante' },
      { shop: 'wolf-online-shop', price: 5974, url: 'https://www.wolf-online-shop.de/Viessmann-VX3-Typ-6-0A5-Stromspeicher-5KW::363487.html', note: '6.0A5 mit 5 kWh' },
      { shop: 'Geizhals', price: 8797, url: 'https://geizhals.de/viessmann-vitocharge-vx3-8-0a10-a3017390.html', note: '8.0A10 mit 10 kWh' },
    ],
  },
  'sungrow-sbr128': {
    msrp_eur: 5000,
    offers: [
      { shop: 'Geizhals', price: 3780, url: 'https://geizhals.de/sungrow-sbr128-a2814804.html', note: 'Preisvergleich, ab' },
      { shop: 'Sonnenshop', price: 4641, url: 'https://www.sonnenshop.de/sungrow-sbr128-premium-batteriespeicher', note: 'SBR128 Premium' },
      { shop: 'knauer24', price: 4570, url: 'https://knauer24.de/Sungrow-SBR128-128-kWh-4-x-320kWh-Batterie-V132', note: 'V13.2, 12.8 kWh' },
      { shop: 'solar-handel.de', price: 4200, url: 'https://solar-handel.de/products/sungrow-sbr128-batteriespeicher-128kwh-v13', note: '10% Sale' },
      { shop: 'Memodo', price: 4800, url: 'https://www.memodo-shop.com/sungrow-sbr128/6768', note: 'Großhandel' },
    ],
  },
  'enphase-iq-battery-5p': {
    msrp_eur: 3200,
    offers: [
      { shop: 'Geizhals', price: 2639, url: 'https://geizhals.de/enphase-iq-battery-5p-mit-flexphase-iqbattery-5p-3p-int-a3411831.html', note: 'mit FlexPhase, ab' },
      { shop: 'Alma Solarshop', price: 2700, url: 'https://www.alma-solarshop.de/enphase-batterien/3186-enphase-batterie-iq-5p-dreiphasig.html', note: '5 kWh, 0% MwSt' },
      { shop: 'Enphase Store', price: 3200, url: 'https://enphase.com/store/storage/gen3/iq-battery-5p', note: 'Offiziell' },
    ],
  },
  'varta-wall-15': {
    msrp_eur: 6949,
    offers: [
      { shop: 'mg-solar-shop', price: 5502, url: 'https://www.mg-solar-shop.de/', note: 'VARTA.wall 15' },
      { shop: 'energiespeicher-online', price: 5800, url: 'https://www.energiespeicher-online.shop/', note: 'VARTA.wall' },
      { shop: 'solarspeicher24', price: 6200, url: 'https://solarspeicher24.de/', note: '15 kWh System' },
    ],
  },
  'growatt-ark-hv': {
    msrp_eur: 2500,
    offers: [
      { shop: 'Geizhals', price: 208, url: 'https://geizhals.de/growatt-ark-hv-h-v136492.html', note: 'Einzelmodul 2.56 kWh, ab' },
      { shop: 'tepto.de', price: 1800, url: 'https://www.tepto.de/Growatt-ARK-HV-Speicherpaket-7-68-kWh-PV1186.7', note: '7.68 kWh Paket' },
      { shop: 'SolarScouts', price: 5600, url: 'https://solarscouts.de/?a=2985&lang=eng', note: '15.3 kWh System' },
      { shop: 'UltraSolar24', price: 450, url: 'https://ultrasolar24.de/speicher/growatt/batterie-system/batterie-ark-hv-hochvolt-bis-25-6-kw/5/growatt-ark-2.5h-a2-hochvolt-solarspeicher-fuer-spa-sph-und-mod-wechselrichter', note: 'ARK-2.5H Modul' },
      { shop: 'WML Solar', price: 420, url: 'https://www.wml-solar.de/shop/Growatt-ARK-2-5H-A1-Hochspannungs-Batteriemodul-2-56-fur-HV-und-XH-Batteriesystem-p550627122', note: '2.56 kWh Modul' },
    ],
  },
  'fox-ess-ecs2900': {
    msrp_eur: 3200,
    offers: [
      { shop: 'Basic Solar', price: 2769, url: 'https://basic-solar.de/shop/speicher/fox-ess-batteriespeicher-ecs-2900-8-64-kwh/', note: 'H3, 8.64 kWh' },
      { shop: 'Basic Solar', price: 3149, url: 'https://basic-solar.de/shop/speicher/fox-ess-ecs-2900-11-52-kwh-solarspeicher-h4-2/', note: 'H4, 11.52 kWh' },
      { shop: 'Selfio', price: 3100, url: 'https://www.selfio.de/produkte/fox-ess-batteriespeicher-ecs2900-h3-8-64-kwh', note: 'H3, 8.64 kWh' },
      { shop: 'Selfio', price: 4953, url: 'https://www.selfio.de/photovoltaik/stromspeicher/fox-ess-batteriespeicher-ecs2900-h6-17-28-kwh', note: 'H6, 17.28 kWh' },
      { shop: 'Elektroland24', price: 3500, url: 'https://www.elektroland24.de/neue-energien/stromspeicher/fox-ess-ecs2900-h5-solarspeicher-14-40-kwh.html', note: 'H5, 14.4 kWh' },
    ],
  },
  'qcells-qhome-core': {
    msrp_eur: 5500,
    offers: [
      { shop: 'Q CELLS Shop', price: 5500, url: 'https://shop.q-cells.com/qcells/de/EUR/c/Q.HOME%20CORE', note: 'Offizieller Shop' },
      { shop: 'inutec', price: 5200, url: 'https://www.inutec-int.com/QHOME-ESS-HYB-G3-complete-system-with-6Wh-storage-inverters-from-6-to-15-kW_5', note: 'ESS HYB-G3 System' },
      { shop: 'Münchner Solarmarkt', price: 5000, url: 'https://www.shop-muenchner-solarmarkt.de/solarmodule/q-cells-solarmodule/', note: 'Auf Anfrage' },
    ],
  },
  'dyness-tower-t10': {
    msrp_eur: 2800,
    offers: [
      { shop: 'SolarScouts', price: 1827, url: 'https://solarscouts.de/Dyness-Tower-T10-1066-kWh-Battery-Storage-Your-Ideal-10-kWh-Photovoltaic-Storage-with-BDU-15G', note: '10.66 kWh, günstigster' },
      { shop: 'Geizhals', price: 2089, url: 'https://geizhals.de/dyness-tower-t10-a3037391.html', note: 'Preisvergleich, ab' },
      { shop: 'mg-solar-shop', price: 2200, url: 'https://www.mg-solar-shop.de/Dyness-Tower-2.0-T10-Batteriespeicher-10-66-kWh', note: 'Tower 2.0' },
      { shop: 'Elektroland24', price: 2300, url: 'https://www.elektroland24.de/neue-energien/stromspeicher/dyness-tower-t10-version-1.5-solarspeicher-10kwh-kompatibel-mit-vielen-wechselrichter-herstellern.html', note: 'Version 1.5' },
      { shop: 'PlentiSolar', price: 2400, url: 'https://www.plentisolar.de/plenti-solar-dyness-tower-t10-10-6-kwh-batteriespeicher-288v-3-module-hochvolt/a-1051689', note: '288V 3 Module' },
    ],
  },
  'tesla-powerwall-3': {
    msrp_eur: 8200,
    offers: [
      { shop: 'Alma Solarshop', price: 7200, url: 'https://www.alma-solarshop.de/tesla-batterie/3390-tesla-batterie-powerwall-3.html', note: '13.5 kWh' },
      { shop: 'energiespeicher-online', price: 7500, url: 'https://www.energiespeicher-online.shop/Energiespeicher/Speicher-Typ/DC/tesla-powerwall-3-inklusive-notstromfaehigem-gateway-2', note: 'inkl. Gateway 2' },
      { shop: 'Wallbox Discounter', price: 7400, url: 'https://www.wallboxdiscounter.com/de/tesla-powerwall-3-13-kwh-solarspeicher.html', note: 'AC Solarspeicher' },
      { shop: 'BatteriespeicherDE', price: 7600, url: 'https://batteriespeicherdeutschland.de/product/tesla-powerwall-3/', note: 'Preis vergleichen' },
      { shop: 'BayWa r.e.', price: 7800, url: 'https://solar-distribution.baywa-re.de/en/storage-parts/tesla-powerwall-3-13-5kwh-4-6kw.html', note: '13.5 kWh / 4.6 kW' },
    ],
  },
  'pylontech-force-h2': {
    msrp_eur: 2500,
    offers: [
      { shop: 'Geizhals', price: 500, url: 'https://geizhals.de/pylontech-force-h2-v132964.html', note: 'Einzelmodul 3.55 kWh, ab' },
      { shop: 'Solarfy', price: 599, url: 'https://www.solarfy.de/Pylontech-Force-H2-Batteriemodul', note: 'BMS + Basis' },
      { shop: 'Geizhals', price: 2100, url: 'https://geizhals.de/pylontech-force-h2-a2966795.html', note: '2 Module, 7.1 kWh' },
      { shop: 'Alma Solar', price: 1800, url: 'https://www.alma-solarshop.de/pylontech-akku/1582-pylontech-force-h2-355kwh-batterie.html', note: '3.55 kWh Modul' },
      { shop: 'Memodo', price: 2400, url: 'https://www.memodo-shop.com/pylontech-force-h2-7.1-kwh/11258', note: '7.1 kWh System' },
    ],
  },
  'solax-triple-power-t58': {
    msrp_eur: 2200,
    offers: [
      { shop: 'Bau.Shop', price: 1749, url: 'https://bau.shop/Solax-Speicher-Triple-Power-Akku-T58-V2-230-kWh', note: 'Slave 5.8 kWh' },
      { shop: 'Bau.Shop', price: 3529, url: 'https://bau.shop/Solax-Speicher-Triple-Power-Akku-T58-V2-115-kWh', note: '11.5 kWh (2 Module)' },
      { shop: 'PrimeSolar', price: 1850, url: 'https://www.primesolar-shop.de/triple-power-slave-hochvoltspeicher-58-kw-lfp', note: 'Slave Modul LFP' },
      { shop: 'inutec', price: 1900, url: 'https://www.inutec-int.com/en/products/solax-bms-parallel-box-ii-g2-fur-t58-speicher', note: 'BMS Parallel Box' },
    ],
  },
};

/**
 * Get price data for a storage system by slug
 * @param {string} slug - Storage system slug
 * @returns {object|null} Price data with msrp and offers
 */
export function getStoragePrices(slug) {
  return storagePrices[slug] || null;
}

/**
 * Get the cheapest offer price for a storage system
 * @param {string} slug - Storage system slug
 * @returns {number|null} Cheapest price in EUR
 */
export function getCheapestPrice(slug) {
  const data = storagePrices[slug];
  if (!data || !data.offers.length) return null;
  return Math.min(...data.offers.map((o) => o.price));
}

/**
 * Get discount percentage vs MSRP
 * @param {string} slug - Storage system slug
 * @returns {number|null} Discount percentage (0-100)
 */
export function getDiscountPercent(slug) {
  const data = storagePrices[slug];
  if (!data || !data.msrp_eur || !data.offers.length) return null;
  const cheapest = Math.min(...data.offers.map((o) => o.price));
  const discount = Math.round(((data.msrp_eur - cheapest) / data.msrp_eur) * 100);
  return discount > 0 ? discount : null;
}

/**
 * Get number of available offers
 * @param {string} slug - Storage system slug
 * @returns {number} Number of offers
 */
export function getOfferCount(slug) {
  const data = storagePrices[slug];
  return data ? data.offers.length : 0;
}

export default storagePrices;
