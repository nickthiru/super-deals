<script>
  import FooterLinks from './FooterLinks.svelte';
  import SocialIcons from './SocialIcons.svelte';
  import { quickLinks, categoryLinks, socialLinks } from './data.js';
</script>

<footer class="footer">
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-row">
        <div class="footer-column">
          <div class="company-info">
            <h2 class="footer-logo">Super Deals</h2>
            <p class="company-description">
              Your destination for the best online deals and discounts.
            </p>
          </div>
        </div>
        
        <div class="footer-column">
          <FooterLinks title="Quick Links" links={quickLinks} />
        </div>
        
        <div class="footer-column">
          <FooterLinks title="Categories" links={categoryLinks} />
        </div>
        
        <div class="footer-column">
          <SocialIcons title="Follow Us" icons={socialLinks} />
        </div>
      </div>
    </div>
    
    <div class="copyright">
      © {new Date().getFullYear()} Super Deals. All rights reserved.
    </div>
  </div>
</footer>

<style>
  .footer {
    background-color: var(--background-dark);
    padding: var(--spacing-xl) var(--section-padding-x);
  }

  .footer-container {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .footer-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-xl);
  }

  .company-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .footer-logo {
    color: var(--text-white);
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin: 0;
  }

  .company-description {
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0;
  }

  .copyright {
    color: var(--text-muted);
    text-align: center;
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--border-color);
  }

  @media (max-width: 991px) {
    .footer {
      padding: var(--spacing-lg) var(--section-mobile-padding);
    }

    .footer-row {
      grid-template-columns: 1fr;
      gap: var(--spacing-xl);
    }
  }
</style>
