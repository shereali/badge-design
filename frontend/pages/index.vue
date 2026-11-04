<template>
  <div class="relative overflow-hidden">
    <!-- Hero Background Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/3 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Hero Section -->
    <section class="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Left Column: Copy -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm">
              <span class="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              The Next-Gen Online Badge & ID Card Studio
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Design & Print <br />
              <span class="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
                Professional Badges
              </span> <br />
              in Just Minutes.
            </h1>

            <p class="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Create stunning conference badges, corporate employee IDs, VIP seminar passes, and student cards. Featuring dual-sided design, live QR codes, and print-ready PDF export.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <NuxtLink
                :to="authStore.isAuthenticated ? '/my-badge' : '/register'"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-300 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
              >
                <Icon name="mdi:sparkles" class="text-xl" />
                <span>Start Designing Free</span>
              </NuxtLink>

              <NuxtLink
                to="#templates"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 shadow-sm transition-all text-base"
              >
                <Icon name="mdi:cards-outline" class="text-xl text-slate-500" />
                <span>Explore Templates</span>
              </NuxtLink>
            </div>

            <div class="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs sm:text-sm text-slate-500">
              <div class="flex items-center gap-1.5">
                <Icon name="mdi:check-circle" class="text-emerald-500 text-lg" />
                <span>No credit card required</span>
              </div>
              <div class="flex items-center gap-1.5">
                <Icon name="mdi:check-circle" class="text-emerald-500 text-lg" />
                <span>Instant PDF print export</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Badge Showcase Preview -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-full max-w-sm">
              <!-- Lanyard Ribbon Visual -->
              <div class="w-12 h-20 bg-gradient-to-b from-indigo-700 to-indigo-600 mx-auto rounded-t-lg shadow-md flex items-center justify-center -mb-3 z-0">
                <div class="w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-100 shadow-inner"></div>
              </div>

              <!-- Main Badge Card Mockup -->
              <div class="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 overflow-hidden">
                <!-- Lanyard Slot -->
                <div class="w-12 h-2 bg-slate-300 rounded-full mx-auto mb-4 border border-slate-400"></div>

                <!-- Event Header Banner -->
                <div class="bg-gradient-to-r from-indigo-600 to-blue-600 -mx-6 -mt-2 p-4 text-white text-center">
                  <span class="text-[10px] uppercase font-bold tracking-widest text-indigo-200 block">GLOBAL TECH SUMMIT 2026</span>
                  <h3 class="text-lg font-bold">ALL ACCESS VIP PASS</h3>
                </div>

                <!-- Avatar & Details -->
                <div class="pt-6 pb-4 flex flex-col items-center text-center">
                  <div class="w-24 h-24 rounded-full border-4 border-indigo-100 shadow-md overflow-hidden bg-slate-100 mb-3">
                    <img src="/assets/img/profile.jpg" alt="Attendee" class="w-full h-full object-cover" />
                  </div>
                  <h4 class="text-xl font-bold text-slate-900">Dr. Abdullah Al Mamun</h4>
                  <p class="text-sm font-semibold text-indigo-600">Chief Technology Officer</p>
                  <p class="text-xs text-slate-500">Softcredible Solutions Ltd.</p>
                </div>

                <!-- QR Code & Access Badge -->
                <div class="border-t border-slate-100 pt-4 flex items-center justify-between px-2">
                  <div class="flex flex-col text-left">
                    <span class="text-[10px] text-slate-400 uppercase font-semibold">Attendee ID</span>
                    <span class="text-xs font-mono font-bold text-slate-700">#VIP-2026-9041</span>
                    <span class="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded">
                      VERIFIED PASS
                    </span>
                  </div>

                  <div class="p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <Icon name="mdi:qrcode-scan" class="text-4xl text-slate-800" />
                  </div>
                </div>

                <!-- Badge Floating Badge Indicator -->
                <div class="absolute bottom-2 right-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                  A6 Standard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Section -->
    <section id="features" class="py-20 bg-white border-y border-slate-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto space-y-4">
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-widest">Everything You Need</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900">
            A Complete Studio Built for Badges & IDs
          </h2>
          <p class="text-base sm:text-lg text-slate-600">
            From drag-and-drop elements to instant high-resolution printing, PorichoyID gives you complete control over your identity cards.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <!-- Feature 1 -->
          <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all">
            <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mb-5">
              <Icon name="mdi:flip-horizontal" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Dual-Sided (Front & Back)</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Design both the front and back of badges simultaneously with flip animations, keeping event schedules and emergency contacts on reverse.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-5">
              <Icon name="mdi:qrcode-plus" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Dynamic QR & Barcodes</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Add auto-generating QR codes for attendee check-in, contact info, gate passes, or website links with customizable styling and colors.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-5">
              <Icon name="mdi:file-pdf-box" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Print-Ready PDF Export</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Export high-resolution PDFs formatted exactly for physical printers, thermal card machines, or desktop laminators with zero blur.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all">
            <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-5">
              <Icon name="mdi:punch-clock" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Lanyard Punch Hole Guides</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Preview center circular holes, dual clips, or horizontal oval slots so important text and photos are never cut through by clips.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-5">
              <Icon name="mdi:aspect-ratio" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Standard Sizes & CR80</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Choose from standard conference presets (A4, A6, A7) or customize precise millimeter and pixel dimensions for plastic cards.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all">
            <div class="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mb-5">
              <Icon name="mdi:shield-check-outline" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Cloud Cloud Sync & Badges</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Save and manage all your organization's badges in your secure account. Re-open, duplicate, edit, and print whenever you need.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Templates Showcase Section -->
    <section id="templates" class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto space-y-4">
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-widest">Designed for Every Occasion</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Popular Badge Presets & Templates
          </h2>
          <p class="text-base text-slate-600">
            Pick a template or start from blank canvas in our visual studio.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <!-- Template 1 -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
            <div class="h-44 bg-gradient-to-tr from-indigo-900 to-indigo-700 p-4 text-white flex flex-col justify-between relative">
              <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Tech Conference</span>
              <div class="text-center py-2">
                <span class="text-lg font-bold block">SPEAKER PASS</span>
                <span class="text-xs text-indigo-200">DevSummit 2026</span>
              </div>
              <div class="flex justify-between items-center text-[10px]">
                <span>All Access</span>
                <Icon name="mdi:qrcode" class="text-xl" />
              </div>
            </div>
            <div class="p-4 flex items-center justify-between">
              <div>
                <h4 class="font-bold text-sm text-slate-800">Conference Pass</h4>
                <p class="text-xs text-slate-500">A6 Portrait (105×148mm)</p>
              </div>
              <NuxtLink
                :to="authStore.isAuthenticated ? '/my-badge' : '/login'"
                class="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Use
              </NuxtLink>
            </div>
          </div>

          <!-- Template 2 -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
            <div class="h-44 bg-gradient-to-tr from-slate-900 to-slate-800 p-4 text-white flex flex-col justify-between relative">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Corporate ID</span>
              <div class="text-center py-2">
                <span class="text-lg font-bold block">EMPLOYEE BADGE</span>
                <span class="text-xs text-slate-300">Software Engineering</span>
              </div>
              <div class="flex justify-between items-center text-[10px]">
                <span>Building Access</span>
                <Icon name="mdi:barcode" class="text-xl" />
              </div>
            </div>
            <div class="p-4 flex items-center justify-between">
              <div>
                <h4 class="font-bold text-sm text-slate-800">Company Employee ID</h4>
                <p class="text-xs text-slate-500">Standard CR80 Size</p>
              </div>
              <NuxtLink
                :to="authStore.isAuthenticated ? '/my-badge' : '/login'"
                class="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Use
              </NuxtLink>
            </div>
          </div>

          <!-- Template 3 -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
            <div class="h-44 bg-gradient-to-tr from-amber-600 to-amber-700 p-4 text-white flex flex-col justify-between relative">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-100">Exhibition Pass</span>
              <div class="text-center py-2">
                <span class="text-lg font-bold block">VIP EXHIBITOR</span>
                <span class="text-xs text-amber-200">International Expo</span>
              </div>
              <div class="flex justify-between items-center text-[10px]">
                <span>Booth #402</span>
                <Icon name="mdi:qrcode-scan" class="text-xl" />
              </div>
            </div>
            <div class="p-4 flex items-center justify-between">
              <div>
                <h4 class="font-bold text-sm text-slate-800">Exhibitor & Staff</h4>
                <p class="text-xs text-slate-500">A7 Compact (74×105mm)</p>
              </div>
              <NuxtLink
                :to="authStore.isAuthenticated ? '/my-badge' : '/login'"
                class="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Use
              </NuxtLink>
            </div>
          </div>

          <!-- Template 4 -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
            <div class="h-44 bg-gradient-to-tr from-blue-700 to-cyan-600 p-4 text-white flex flex-col justify-between relative">
              <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-100">Campus Identity</span>
              <div class="text-center py-2">
                <span class="text-lg font-bold block">STUDENT ID</span>
                <span class="text-xs text-cyan-100">University Department</span>
              </div>
              <div class="flex justify-between items-center text-[10px]">
                <span>Class of 2026</span>
                <Icon name="mdi:qrcode" class="text-xl" />
              </div>
            </div>
            <div class="p-4 flex items-center justify-between">
              <div>
                <h4 class="font-bold text-sm text-slate-800">Student & Campus ID</h4>
                <p class="text-xs text-slate-500">CR80 Laminated</p>
              </div>
              <NuxtLink
                :to="authStore.isAuthenticated ? '/my-badge' : '/login'"
                class="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Use
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto space-y-4">
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-widest">Simple Workflow</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Create in 3 Easy Steps
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div class="flex flex-col items-center text-center p-6">
            <div class="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
              1
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Create & Choose Size</h3>
            <p class="text-sm text-slate-600">
              Select your card orientation, preset size (A4, A6, A7, custom mm), and lanyard punch hole type.
            </p>
          </div>

          <div class="flex flex-col items-center text-center p-6">
            <div class="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
              2
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Drag & Drop Design</h3>
            <p class="text-sm text-slate-600">
              Add photos, titles, QR codes, logos, and custom color gradients. Easily switch between front and back.
            </p>
          </div>

          <div class="flex flex-col items-center text-center p-6">
            <div class="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
              3
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Download & Print</h3>
            <p class="text-sm text-slate-600">
              Save your badge to cloud and generate high-DPI PDF ready for event check-in or staff badge printers.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto space-y-4">
          <span class="text-xs font-bold text-indigo-600 uppercase tracking-widest">Transparent Plans</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Simple Pricing for Creators & Teams
          </h2>
          <p class="text-base text-slate-600">
            Start for free and upgrade whenever you need high volume export and team collaboration.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          <!-- Free Plan -->
          <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Starter Free</h3>
              <p class="text-xs text-slate-500 mt-1">For single events and personal badges</p>
              <div class="mt-4 mb-6">
                <span class="text-4xl font-black text-slate-900">$0</span>
                <span class="text-xs text-slate-500"> / forever</span>
              </div>
              <ul class="space-y-3 text-sm text-slate-600">
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Unlimited badge designs</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Dual-sided front/back editor</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Live QR & Barcode generator</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Standard PDF export</span>
                </li>
              </ul>
            </div>
            <NuxtLink
              :to="authStore.isAuthenticated ? '/my-badge' : '/register'"
              class="mt-8 block text-center py-2.5 px-4 rounded-xl font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Start Free
            </NuxtLink>
          </div>

          <!-- Pro Plan (Featured) -->
          <div class="bg-white rounded-2xl p-8 border-2 border-indigo-600 shadow-xl relative flex flex-col justify-between">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">Pro Studio</h3>
              <p class="text-xs text-slate-500 mt-1">For event organizers & growing companies</p>
              <div class="mt-4 mb-6">
                <span class="text-4xl font-black text-slate-900">$19</span>
                <span class="text-xs text-slate-500"> / month</span>
              </div>
              <ul class="space-y-3 text-sm text-slate-600">
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600 font-bold" />
                  <span class="font-medium text-slate-800">Everything in Free</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Ultra-high DPI vector print export</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Custom Google fonts & typography</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Custom branding & no watermark</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Priority rendering queue</span>
                </li>
              </ul>
            </div>
            <NuxtLink
              :to="authStore.isAuthenticated ? '/my-badge' : '/register'"
              class="mt-8 block text-center py-2.5 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-300 transition-colors"
            >
              Get Started with Pro
            </NuxtLink>
          </div>

          <!-- Enterprise Plan -->
          <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Enterprise</h3>
              <p class="text-xs text-slate-500 mt-1">For large conferences, universities & scale</p>
              <div class="mt-4 mb-6">
                <span class="text-4xl font-black text-slate-900">$49</span>
                <span class="text-xs text-slate-500"> / month</span>
              </div>
              <ul class="space-y-3 text-sm text-slate-600">
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600 font-bold" />
                  <span>Everything in Pro</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Bulk attendee CSV import & badge merge</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>REST API integration</span>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="mdi:check" class="text-indigo-600" />
                  <span>Dedicated support & custom templates</span>
                </li>
              </ul>
            </div>
            <NuxtLink
              :to="authStore.isAuthenticated ? '/my-badge' : '/register'"
              class="mt-8 block text-center py-2.5 px-4 rounded-xl font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Contact Sales
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="py-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white text-center">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to Create Badges That Impress?
        </h2>
        <p class="text-indigo-200 text-lg max-w-2xl mx-auto">
          Join event managers, HR professionals, and organizers worldwide who design and print badges effortlessly with PorichoyID.
        </p>
        <div>
          <NuxtLink
            :to="authStore.isAuthenticated ? '/my-badge' : '/register'"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-indigo-900 bg-white hover:bg-indigo-50 shadow-xl hover:-translate-y-0.5 transition-all text-base"
          >
            <span>Start Designing Now</span>
            <Icon name="mdi:arrow-right" class="text-lg" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center space-x-2">
          <div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            P
          </div>
          <span class="text-white font-bold">PorichoyID</span>
          <span>© {{ new Date().getFullYear() }} Softcredible. All rights reserved.</span>
        </div>
        <div class="flex items-center space-x-6 text-xs">
          <NuxtLink to="/#features" class="hover:text-white transition-colors">Features</NuxtLink>
          <NuxtLink to="/#templates" class="hover:text-white transition-colors">Templates</NuxtLink>
          <NuxtLink to="/#pricing" class="hover:text-white transition-colors">Pricing</NuxtLink>
          <NuxtLink to="/login" class="hover:text-white transition-colors">Sign In</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
</script>
