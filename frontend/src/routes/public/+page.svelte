<script>
  const categories = [
    { icon: 'fa-solid fa-laptop', name: 'Electronics' },
    { icon: 'fa-solid fa-shirt', name: 'Fashion' },
    { icon: 'fa-solid fa-utensils', name: 'Food & Dining' },
    { icon: 'fa-solid fa-dumbbell', name: 'Sports' },
    { icon: 'fa-solid fa-house', name: 'Home & Living' },
    { icon: 'fa-solid fa-gift', name: 'Gifts' },
    { icon: 'fa-solid fa-car', name: 'Automotive' },
    { icon: 'fa-solid fa-gamepad', name: 'Gaming' }
  ];

  const deals = [
     {
      image:
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/38d1fbeabe-4612651eea8a2f604cc1.png',
      discount: '50% OFF',
      title: 'Latest Smartphone Deal',
      description: 'Get the newest model at half price',
      price: '499'
    },
    {
      image:
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/38a6335e8d-90bb5843b43fad273cea.png',
      discount: '30% OFF',
      title: 'Premium Headphones',
      description: 'Wireless comfort with amazing sound',
      price: '199'
    },
    {
      image:
        'https://storage.googleapis.com/uxpilot-auth.appspot.com/0ce4a16cbc-b63478e1d07ae4bfc4be.png',
      discount: '40% OFF',
      title: 'Smart Watch Sale',
      description: 'Track your fitness in style',
      price: '299'
    }
  ];

  const quickLinks = [
    'About Us',
    'Contact',
    'Terms & Conditions',
    'Privacy Policy'
  ];
  const footerCategories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Sports'
  ];
  const socialIcons = [
    'fa-brands fa-facebook',
    'fa-brands fa-twitter',
    'fa-brands fa-instagram',
    'fa-brands fa-linkedin'
  ];
</script>

<div class="min-h-screen bg-gray-50">
  <header class="fixed z-50 w-full bg-white shadow-sm">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span
            class="cursor-pointer text-2xl font-bold text-facebook"
            >Super Deals</span
          >
          <nav class="ml-8 hidden space-x-6 md:flex">
            <span
              class="cursor-pointer text-gray-600 hover:text-facebook"
              >Front Page</span
            >
            <span
              class="cursor-pointer text-gray-600 hover:text-facebook"
              >Brands</span
            >
            <span
              class="cursor-pointer text-gray-600 hover:text-facebook"
              >Editor's Choice</span
            >
            <span
              class="cursor-pointer text-gray-600 hover:text-facebook"
              >Settings</span
            >
          </nav>
        </div>
        <div class="flex items-center space-x-6">
          <div
            class="hidden items-center rounded-lg bg-gray-100 px-3 py-2 md:flex"
          >
            <i class="fa-solid fa-search text-gray-400"></i>
            <input
              type="text"
              placeholder="Search deals..."
              class="ml-2 border-none bg-transparent focus:outline-none"
            />
          </div>
          <button
            class="font-semibold text-facebook hover:text-facebook-dark"
            >Sign In</button
          >
          <button
            class="rounded-lg bg-facebook px-4 py-2 text-white transition hover:bg-facebook-dark"
            >Sign Up</button
          >
        </div>
      </div>
    </div>
  </header>

  <main class="pt-20">
    <section id="featured-deals" class="bg-white py-12">
      <div class="container mx-auto px-6">
        <div
          class="relative h-[400px] overflow-hidden rounded-lg"
        >
          <img
            class="h-full w-full object-cover"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/08a54bb237-2b943f7f359e42ed8e72.png"
            alt="modern e-commerce featured deals carousel showing various products and discounts, professional photography style"
          />
          <div
            class="absolute inset-0 flex items-center bg-gradient-to-r from-black/50 to-transparent"
          >
            <div class="ml-12 text-white">
              <h1 class="mb-4 text-4xl font-bold">
                Amazing Deals
              </h1>
              <p class="mb-6 text-xl">
                Discover the best offers from top merchants
              </p>
              <button
                class="rounded-lg bg-facebook px-8 py-3 text-white transition hover:bg-facebook-dark"
                >Shop Now</button
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="categories" class="bg-gray-50 py-16">
      <div class="container mx-auto px-6">
        <h2 class="mb-8 text-2xl font-bold">
          Popular Categories
        </h2>
        <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
          {#each categories as { icon, name }}
            <div
              class="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm transition hover:shadow-md"
            >
              <i class="{icon} mb-4 text-3xl text-facebook"
              ></i>
              <h3 class="font-semibold">{name}</h3>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section id="latest-deals" class="bg-white py-16">
      <div class="container mx-auto px-6">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-2xl font-bold">Latest Deals</h2>
          <span
            class="cursor-pointer text-facebook hover:underline"
            >View All</span
          >
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          {#each deals as { image, discount, title, description, price }}
            <div
              class="rounded-lg bg-white shadow-sm transition hover:shadow-md"
            >
              <img
                class="h-48 w-full rounded-t-lg object-cover"
                src={image}
                alt={title}
              />
              <div class="p-6">
                <span
                  class="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600"
                  >{discount}</span
                >
                <h3 class="mt-4 text-lg font-semibold">
                  {title}
                </h3>
                <p class="mt-2 text-gray-600">
                  {description}
                </p>
                <div
                  class="mt-4 flex items-center justify-between"
                >
                  <span class="font-bold text-facebook"
                    >${price}</span
                  >
                  <button
                    class="rounded-lg bg-facebook px-4 py-2 text-white transition hover:bg-facebook-dark"
                    >Buy Now</button
                  >
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section id="merchant-cta" class="bg-facebook py-16">
      <div class="container mx-auto px-6 text-center">
        <h2 class="mb-4 text-3xl font-bold text-white">
          Become a Super Deals Merchant
        </h2>
        <p class="mx-auto mb-8 max-w-2xl text-white/80">
          Join thousands of successful merchants who are
          growing their business with Super Deals. Start
          selling today!
        </p>
        <span
          class="inline-block cursor-pointer rounded-lg bg-white px-8 py-4 font-semibold text-facebook transition hover:bg-gray-100"
          >Start Selling Now</span
        >
      </div>
    </section>
  </main>

  <footer id="footer" class="bg-gray-900 py-12 text-white">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <h3 class="mb-4 text-lg font-bold">
            Super Deals
          </h3>
          <p class="text-gray-400">
            Your destination for the best online deals and
            discounts.
          </p>
        </div>
        <div>
          <h4 class="mb-4 text-lg font-bold">
            Quick Links
          </h4>
          <ul class="space-y-2">
            {#each quickLinks as link}
              <li>
                <span
                  class="cursor-pointer text-gray-400 hover:text-white"
                  >{link}</span
                >
              </li>
            {/each}
          </ul>
        </div>
        <div>
          <h4 class="mb-4 text-lg font-bold">Categories</h4>
          <ul class="space-y-2">
            {#each footerCategories as category}
              <li>
                <span
                  class="cursor-pointer text-gray-400 hover:text-white"
                  >{category}</span
                >
              </li>
            {/each}
          </ul>
        </div>
        <div>
          <h4 class="mb-4 text-lg font-bold">Follow Us</h4>
          <div class="flex space-x-4">
            {#each socialIcons as icon}
              <span
                class="cursor-pointer text-gray-400 hover:text-white"
              >
                <i class={icon}></i>
              </span>
            {/each}
          </div>
        </div>
      </div>
      <div
        class="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400"
      >
        <p>2024 Super Deals. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>
