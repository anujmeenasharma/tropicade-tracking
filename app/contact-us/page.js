'use client';

import { useEffect, useRef } from 'react';

export default function Page() {
  const containerRef = useRef(null);

  useEffect(() => {
    const scripts = [
      "/js/jquery.min.js",
      "/js/popper.min.js",
      "/js/bootstrap.min.js",
      "/js/jquery.waypoints.min.js",
      "/js/jquery.appear.js",
      "/js/numinate.min.js",
      "/js/swiper.min.js",
      "/js/jquery.magnific-popup.min.js",
      "/js/circle-progress.js",
      "/js/jquery.countdown.min.js",
      "/js/aos.js",
      "/js/gsap.js",
      "/js/ScrollTrigger.js",
      "/js/SplitText.js",
      "/js/theia-sticky-sidebar.js",
      "/js/gsap-animation.js",
      "/js/scripts.js"
    ];

    const loadScriptsSequence = async () => {
      for (const src of scripts) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = resolve;
          script.onerror = resolve; // Continue on error
          document.body.appendChild(script);
        });
      }
    };
    
    if (!window.__SCRIPTS_LOADED) {
      window.__SCRIPTS_LOADED = true;
      loadScriptsSequence();
    }

    return () => {
       window.__SCRIPTS_LOADED = false;
       scripts.forEach(src => {
        const scriptUrls = document.querySelectorAll(`script[src="${src}"]`);
        scriptUrls.forEach(s => s.remove());
      });
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/css/fontawesome.css" />
      <link rel="stylesheet" href="/css/flaticon.css" />
      <link rel="stylesheet" href="/css/pbminfotech-base-icons.css" />
      <link rel="stylesheet" href="/css/themify-icons.css" />
      <link rel="stylesheet" href="/css/swiper.min.css" />
      <link rel="stylesheet" href="/css/magnific-popup.css" />
      <link rel="stylesheet" href="/css/aos.css" />
      <link rel="stylesheet" href="/css/shortcode.css" />
      <link rel="stylesheet" href="/css/base.css" />
      <link rel="stylesheet" href="/css/style.css" />
      <link rel="stylesheet" href="/css/responsive.css" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      <div 
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: `
   <!-- Page Wrapper -->
   <div class="page-wrapper">

	<!-- Header Main Area -->
	<header class="site-header header-style-1">
		<div class="pbmit-header-overlay">
			<div class="pbmit-main-header-area">
				<div class="container-fluid">
					<div class="pbmit-header-content d-flex justify-content-between align-items-center">
						<div class="pbmit-logo-menuarea d-flex justify-content-between align-items-center">
							<div class="site-branding">
								<h1 class="site-title">
									<a href="/">
										<img class="logo-img" src="images/logo-white.png" alt="Shipex">
									</a>
								</h1>
							</div>
							<div class="site-navigation">
								<nav class="main-menu navbar-expand-xl navbar-light">
									<div class="navbar-header">
										<!-- Toggle Button -->
										<button class="navbar-toggler" type="button">
											<i class="pbmit-base-icon-menu-1"></i>
										</button>
									</div>
									<div class="pbmit-mobile-menu-bg"></div>
									<div class="collapse navbar-collapse clearfix show" id="pbmit-menu">
										<div class="pbmit-menu-wrap">
											<span class="closepanel">
												<svg class="qodef-svg--close qodef-m" xmlns="http://www.w3.org/2000/svg" width="20.163" height="20.163" viewBox="0 0 26.163 26.163">
													<rect width="36" height="1" transform="translate(0.707) rotate(45)"></rect>
													<rect width="36" height="1" transform="translate(0 25.456) rotate(-45)"></rect>
												</svg>
											</span>
                      <ul class="navigation clearfix">
                        <li><a href="/">Home</a></li>
                        <li><a href="/services">Services</a></li>
                        <li><a href="/about-us">About Us</a></li>
                        <li><a href="/contact-us">Contact Us</a></li>
                      </ul>
										</div>
									</div>
								</nav>
							</div>
						</div>
						<div class="pbmit-right-box d-flex align-items-center">
							<div class="social-links-wrapper">
								<ul class="pbmit-social-links">
									<li class="pbmit-social-li pbmit-social-facebook">
										<a title="Facebook" href="#" target="_blank">
										<span><i class="pbmit-base-icon-facebook-f"></i></span>
										</a>
									</li>
									<li class="pbmit-social-li pbmit-social-twitter">
										<a title="Twitter" href="#" target="_blank">
										<span><i class="pbmit-base-icon-twitter-2"></i></span>
										</a>
									</li>
									<li class="pbmit-social-li pbmit-social-linkedin">
										<a title="LinkedIn" href="#" target="_blank">
										<span><i class="pbmit-base-icon-linkedin-in"></i></span>
										</a>
									</li>
									<li class="pbmit-social-li pbmit-social-instagram">
										<a title="Instagram" href="#" target="_blank">
										<span><i class="pbmit-base-icon-instagram"></i></span>
										</a>
									</li>
								</ul>
							</div>
							<div class="pbmit-header-button2">
								<a class="pbmit-btn pbmit-btn-white" href="/track">
									<span class="pbmit-button-content-wrapper">
										<span class="pbmit-button-text">Track your parcel</span>
									</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Title Bar -->
		<div class="pbmit-title-bar-wrapper">
			<div class="container">
				<div class="pbmit-title-bar-content">
					<div class="pbmit-title-bar-content-inner">
						<div class="pbmit-tbar">
							<div class="pbmit-tbar-inner container">
								<h1 class="pbmit-tbar-title"> Contact Us</h1>
							</div>
						</div>
						<div class="pbmit-breadcrumb">
							<div class="pbmit-breadcrumb-inner">
								<span>
									<a title="" href="#" class="home"><span>Titan X Logistics</span></a>
								</span>
								<span class="sep">
									<i class="pbmit-base-icon-angle-right"></i>
								</span>
								<span><span class="post-root post post-post current-item"> Contact Us</span></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Title Bar End-->
	</header>
	<!-- Header Main Area End Here -->

		<!-- Contact Us Content -->
		<div class="page-content">

			<!-- Ihbox -->
            <section class="section-xl">
				<div class="container">
					<div class="row">
						<article class="pbmit-miconheading-style-5 col-md-6 col-lg-4 col-xl-3">
							<div class="pbmit-ihbox-style-5">
								<div class="pbmit-ihbox-headingicon">
									<div class="pbmit-ihbox-wrap">
										<div class="pbmit-ihbox-contents">
											<h2 class="pbmit-element-title">
												Mail Us 24/7
											</h2>
											<div class="pbmit-heading-desc">info@titanxlogistics.us <br>
											</div>
										</div>
										<div class="pbmit-ihbox-icon">
											<div class="pbmit-ihbox-icon-wrapper pbmit-icon-type-icon">
												<svg height="512" viewBox="0 0 32 32" width="512" xmlns="http://www.w3.org/2000/svg"><g id="Layer_34" data-name="Layer 34"><path d="m30 9v14a3 3 0 0 1 -3 3h-22a3 3 0 0 1 -3-3v-14a2.87 2.87 0 0 1 .19-1l12.15 8.1a3 3 0 0 0 3.32 0l12.15-8.1a2.87 2.87 0 0 1 .19 1zm-13.45 5.43 12-8a3 3 0 0 0 -1.55-.43h-22a3 3 0 0 0 -1.54.44l12 8a1 1 0 0 0 1.09-.01z"></path></g></svg>
											</div>
										</div>
									</div>
									<div class="pbmit-btn-wrap">
										<div class="pbmit-ihbox-btn">
											<a class="pbmit-button-inner" href="/about-us">
												<span class="pbmit-button-icon"></span>
											</a>
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-miconheading-style-5 col-md-6 col-lg-4 col-xl-3">
							<div class="pbmit-ihbox-style-5">
								<div class="pbmit-ihbox-headingicon">
									<div class="pbmit-ihbox-wrap">
										<div class="pbmit-ihbox-contents">
											<h2 class="pbmit-element-title">
												Our Location
											</h2>
											<div class="pbmit-heading-desc">85 Preston, Inglewood, Maine <br>
												98380, Hoofddorp Noord- 2132
											</div>
										</div>
										<div class="pbmit-ihbox-icon">
											<div class="pbmit-ihbox-icon-wrapper pbmit-icon-type-icon">
												<svg enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="_x34_3_Location"><g><path d="m256.058 504.533c-73.993 0-131.957-30.2-131.957-68.757 0-23.918 22.7-45.63 60.726-58.091 3.808-1.249 7.889.825 9.134 4.628 1.244 3.799-.829 7.889-4.628 9.134-31.303 10.255-50.753 27.241-50.753 44.33 0 29.423 53.798 54.279 117.479 54.279 63.639 0 117.404-24.856 117.404-54.279 0-17.089-19.45-34.074-50.758-44.33-3.799-1.244-5.872-5.335-4.628-9.134 1.244-3.794 5.316-5.877 9.134-4.628 38.029 12.456 60.731 34.173 60.731 58.091-.002 38.556-57.933 68.757-131.884 68.757z"></path><path d="m256.058 472.221c-2.394 0-4.746-.038-7.065-.156-41.493-1.918-71.636-19.714-71.636-42.317 0-11.382 7.724-21.939 21.745-29.724 3.497-1.937 7.899-.679 9.845 2.814 1.942 3.497.679 7.904-2.814 9.845-9.087 5.043-14.299 11.264-14.299 17.065 0 12.164 23.254 26.256 57.865 27.858 4.185.212 8.417.217 12.602 0 34.654-1.569 57.903-15.67 57.903-27.858 0-5.802-5.212-12.023-14.299-17.065-3.492-1.942-4.755-6.348-2.814-9.845 1.946-3.497 6.344-4.751 9.845-2.814 14.021 7.786 21.745 18.343 21.745 29.724 0 22.641-30.149 40.437-71.679 42.317-2.273.118-4.587.156-6.944.156z"></path><g><path d="m256.024 7.467c-84.07 0-152.454 68.384-152.454 152.406 0 81.849 140.872 251.629 146.904 258.82 1.351 1.641 3.378 2.606 5.55 2.606 2.123 0 4.199-.966 5.55-2.606 5.984-7.191 146.856-176.971 146.856-258.82 0-84.021-68.336-152.406-152.406-152.406zm0 103.615c30.114 0 54.63 24.468 54.63 54.63 0 30.114-24.516 54.582-54.63 54.582-30.115 0-54.631-24.468-54.631-54.582.001-30.162 24.517-54.63 54.631-54.63z"></path></g></g></g><g id="Layer_1"></g></svg>
											</div>
										</div>
									</div>
									<div class="pbmit-btn-wrap">
										<div class="pbmit-ihbox-btn">
											<a class="pbmit-button-inner" href="/about-us">
												<span class="pbmit-button-icon"></span>
											</a>
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-miconheading-style-5 col-md-6 col-lg-4 col-xl-3">
							<div class="pbmit-ihbox-style-5">
								<div class="pbmit-ihbox-headingicon">
									<div class="pbmit-ihbox-wrap">
										<div class="pbmit-ihbox-contents">
											<h2 class="pbmit-element-title">
												Call US 24/7
											</h2>
											<div class="pbmit-heading-desc">Phone: Not available<br>
												Mobile: Not available
											</div>
										</div>
										<div class="pbmit-ihbox-icon">
											<div class="pbmit-ihbox-icon-wrapper pbmit-icon-type-icon">
												<svg id="glyph" height="512" viewBox="0 0 64 64" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m59.96 49.01a4.62953 4.62953 0 0 0 -2.75-3.78c-2.31-1.03-6.61-2.91-9.39-3.95-4.45-1.66-6.29.68-6.38.8-.02.03-1.81 2.46-4.08 2.89-1.31.26-6.72-4-10.9-8.11-5.72-6.08-7.58-9.45-7.43-10.22.43-2.27 2.86-4.07 2.91-4.1.1-.07 2.44-1.92.78-6.37-1.03-2.77-2.92-7.07-3.95-9.38-1.5764-3.4361-5.5521-3.29475-8.68-1.73993-8.7274 6.65643-9.34882 21.56059 7.29029 39.04981 11.36282 11.06264 19.38064 15.59555 28.57961 15.88034 8.9001-.00022 12.9401-5.98022 12.9901-6.06022a9.325 9.325 0 0 0 1.01-4.91z"></path><path d="m31.8667 23.2832a9.01535 9.01535 0 0 1 7.90864 7.9078.99981.99981 0 0 0 1.98636-.22667 11.02563 11.02563 0 0 0 -9.6685-9.66833 1.00005 1.00005 0 1 0 -.2265 1.98724z"></path><path d="m32.41748 18.34473a14.00139 14.00139 0 0 1 12.29533 12.29548 1.00016 1.00016 0 0 0 1.98835-.215 16.0126 16.0126 0 0 0 -14.06892-14.06867 1.00007 1.00007 0 0 0 -.21476 1.98819z"></path><path d="m32.96729 13.39648a19.0343 19.0343 0 0 1 16.69371 16.69346 1.00056 1.00056 0 0 0 1.98837-.22184 21.046 21.046 0 0 0 -18.46003-18.4588 1 1 0 0 0 -.22205 1.98718z"></path></svg>
											</div>
										</div>
									</div>
									<div class="pbmit-btn-wrap">
										<div class="pbmit-ihbox-btn">
											<a class="pbmit-button-inner" href="/about-us">
												<span class="pbmit-button-icon"></span>
											</a>
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-miconheading-style-5 col-md-6 col-lg-4 col-xl-3">
							<div class="pbmit-ihbox-style-5">
								<div class="pbmit-ihbox-headingicon">
									<div class="pbmit-ihbox-wrap">
										<div class="pbmit-ihbox-contents">
											<h2 class="pbmit-element-title">
												Working Days
											</h2>
											<div class="pbmit-heading-desc">Mon to Fri - 09:00 to 06:00pm<br>
												Saturday to Sunday - Closed
											</div>
										</div>
										<div class="pbmit-ihbox-icon">
											<div class="pbmit-ihbox-icon-wrapper pbmit-icon-type-icon">
												<svg id="bold" enable-background="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m16.25 13h-1.25v-.75c0-.965-.785-1.75-1.75-1.75h-2.5c-.965 0-1.75.785-1.75 1.75v.75h-1.25c-.492 0-.935.205-1.253.533l5.503 2.871 5.503-2.871c-.318-.328-.761-.533-1.253-.533zm-5.75 0v-.75c0-.138.112-.25.25-.25h2.5c.138 0 .25.112.25.25v.75z"></path><path d="m12.347 17.915c-.217.113-.477.113-.693 0l-5.654-2.95v4.285c0 .965.785 1.75 1.75 1.75h8.5c.965 0 1.75-.785 1.75-1.75v-4.285z"></path><path d="m21 3h-1v-2c0-.552-.448-1-1-1h-1c-.552 0-1 .448-1 1v2h-10v-2c0-.552-.448-1-1-1h-1c-.552 0-1 .448-1 1v2h-1c-1.654 0-3 1.346-3 3v15c0 1.654 1.346 3 3 3h18c1.654 0 3-1.346 3-3v-15c0-1.654-1.346-3-3-3zm0 19h-18c-.552 0-1-.448-1-1v-11.96h20v11.96c0 .552-.448 1-1 1z"></path></svg>
											</div>
										</div>
									</div>
									<div class="pbmit-btn-wrap">
										<div class="pbmit-ihbox-btn">
											<a class="pbmit-button-inner" href="/about-us">
												<span class="pbmit-button-icon"></span>
											</a>
										</div>
									</div>
								</div>
							</div>
						</article>
					</div>
				</div>
            </section>
            <!-- Ihbox End -->

			<!-- Contact Form -->
			<section>
				<div class="container">
					<div class="row g-0">
						<div class="col-md-12 col-xl-6">
							<div class="contact-us-left-area">
								<div class="pbmit-heading-subheading animation-style4">
									<h4 class="pbmit-subtitle">Contact us</h4>
									<h2 class="pbmit-title">Write us what you want to know</h2>
									<div class="pbmit-heading-desc">
										We carefully screen all of our cleaners, so you can rest assured that <br> your home would receive the absolute highest quality of service providing.
									</div>
								</div>
								<div class="contact-bg-img">
									<img src="images/img.png" alt="">
								</div>
							</div>
						</div>
						<div class="col-md-12 col-xl-6">
							<div class="contact-form-rightbox pbmit-bg-color-white">
								<div class="pbmit-heading animation-style2">
									<h2 class="pbmit-title">Send a message to staff</h2>
								</div>
								<p>Your email address will not be published. Required fields are marked *</p>
								<form class="contact-form" method="post" id="contact-form" action="send-dummy.php">
									<div class="row">
										<div class="col-md-6">
											<input type="text" class="form-control" placeholder="Your Name" name="name" required>
										</div>
										<div class="col-md-6">
											<input type="email" class="form-control" placeholder="Your Email" name="email" required>
										</div>
										<div class="col-md-6">
											<input type="tel" class="form-control" placeholder="Your Phone" name="phone" required>
										</div>
										<div class="col-md-6">
											<input type="text" class="form-control" placeholder="Subject" name="subject" required>
										</div>
										<div class="col-md-12">
											<textarea name="message" cols="40" rows="10" class="form-control" placeholder="Message" required></textarea>
										</div>
										<div class="col-md-12">
											<div class="form-check">
												<label class="form-check-label">
													<input class="form-check-input" type="checkbox">
													Save my name, email, and website in this browser for the next time I comment.
												</label>
											</div>
										</div>
									</div>
									<button class="pbmit-btn submit my-4">
										<span class="pbmit-button-content-wrapper">
											<span class="pbmit-button-text">Submit</span>
										</span>
										<span class="form-btn-loader d-none">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><circle fill="#fff" stroke="#fff" stroke-width="15" r="15" cx="40" cy="50"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#fff" stroke="#fff" stroke-width="15" r="15" cx="100" cy="50"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#fff" stroke="#fff" stroke-width="15" r="15" cx="160" cy="50"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
										</span>
									</button>
									<div class="col-md-12 col-lg-12 message-status"></div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- Contact Form End -->

			<!-- Client Start -->
			<section class="section-xl border-bottom">
				<div class="container-fluid">
					<div class="row pbmit-element-posts-wrapper">
						<article class="pbmit-client-style-1 col-md-4 col-lg-3 col-xl-2">
							<div class="pbmit-border-wrapper">
								<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
									<h4 class="pbmit-hide">Client-01</h4>
									<div class="pbmit-client-hover-img">
										<img src="images/client/client-global-01.png" class="img-fluid" alt="">
									</div>
									<div class="pbmit-featured-img-wrapper">
										<div class="pbmit-featured-wrapper">
											<img src="images/client/client-dark-01.png" class="img-fluid" alt="">
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-client-style-1 col-md-4 col-lg-3 col-xl-2">
							<div class="pbmit-border-wrapper">
								<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
									<h4 class="pbmit-hide">Client-01</h4>
									<div class="pbmit-client-hover-img">
										<img src="images/client/client-global-02.png" class="img-fluid" alt="">
									</div>
									<div class="pbmit-featured-img-wrapper">
										<div class="pbmit-featured-wrapper">
											<img src="images/client/client-dark-02.png" class="img-fluid" alt="">
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-client-style-1 col-md-4 col-lg-3 col-xl-2">
							<div class="pbmit-border-wrapper">
								<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
									<h4 class="pbmit-hide">Client-01</h4>
									<div class="pbmit-client-hover-img">
										<img src="images/client/client-global-03.png" class="img-fluid" alt="">
									</div>
									<div class="pbmit-featured-img-wrapper">
										<div class="pbmit-featured-wrapper">
											<img src="images/client/client-dark-03.png" class="img-fluid" alt="">
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-client-style-1 col-md-4 col-lg-3 col-xl-2">
							<div class="pbmit-border-wrapper">
								<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
									<h4 class="pbmit-hide">Client-01</h4>
									<div class="pbmit-client-hover-img">
										<img src="images/client/client-global-04.png" class="img-fluid" alt="">
									</div>
									<div class="pbmit-featured-img-wrapper">
										<div class="pbmit-featured-wrapper">
											<img src="images/client/client-dark-04.png" class="img-fluid" alt="">
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-client-style-1 col-md-4 col-lg-3 col-xl-2">
							<div class="pbmit-border-wrapper">
								<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
									<h4 class="pbmit-hide">Client-01</h4>
									<div class="pbmit-client-hover-img">
										<img src="images/client/client-global-05.png" class="img-fluid" alt="">
									</div>
									<div class="pbmit-featured-img-wrapper">
										<div class="pbmit-featured-wrapper">
											<img src="images/client/client-dark-05.png" class="img-fluid" alt="">
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-client-style-1 col-md-4 col-lg-3 col-xl-2">
							<div class="pbmit-border-wrapper">
								<div class="pbmit-client-wrapper pbmit-client-with-hover-img">
									<h4 class="pbmit-hide">Client-01</h4>
									<div class="pbmit-client-hover-img">
										<img src="images/client/client-global-06.png" class="img-fluid" alt="">
									</div>
									<div class="pbmit-featured-img-wrapper">
										<div class="pbmit-featured-wrapper">
											<img src="images/client/client-dark-06.png" class="img-fluid" alt="">
										</div>
									</div>
								</div>
							</div>
						</article>
					</div>
				</div>
			</section>
			<!-- Client End -->

		</div>
		<!-- Contact Us Content End -->

    <!-- footer -->
		<footer class="site-footer pbmit-bg-color-secondary">
			<div class="pbmit-footer-big-area-wrapper">
				<div class="pbmit-footer-widget-area">
					<div class="container">
						<div class="row">
							<div class="pbmit-footer-widget-col-1 col-md-4">
								<aside class="widget">
									<div class="pbmit-footer-logo">
										<img src="images/footer-logo.svg" class="img-fluid" alt="">
									</div><br>
									<ul class="pbmit-social-links">
										<li class="pbmit-social-li pbmit-social-facebook">
											<a title="Facebook" href="#" target="_blank">
												<span><i class="pbmit-base-icon-facebook-f"></i></span>
											</a>
										</li>
										<li class="pbmit-social-li pbmit-social-twitter">
											<a title="Twitter" href="#" target="_blank">
												<span><i class="pbmit-base-icon-twitter-2"></i></span>
											</a>
										</li>
										<li class="pbmit-social-li pbmit-social-linkedin">
											<a title="LinkedIn" href="#" target="_blank">
												<span><i class="pbmit-base-icon-linkedin-in"></i></span>
											</a>
										</li>
										<li class="pbmit-social-li pbmit-social-instagram">
											<a title="Instagram" href="#" target="_blank">
												<span><i class="pbmit-base-icon-instagram"></i></span>
											</a>
										</li>
									</ul>
								</aside>
							</div>
							<div class="pbmit-footer-widget-col-2 col-md-4">
								<aside class="widget">
									<h2 class="widget-title">Contact Us</h2>
									<div class="pbmit-contact-widget-lines">
										<div class="pbmit-contact-widget-line pbmit-base-icon-email">info@titanxlogistics.us</div>
									</div>
								</aside>
							</div>
							<div class="pbmit-footer-widget-col-3 col-md-2">
								<aside class="widget">
									<h2 class="widget-title">Useful Link</h2>
									<ul class="menu">
										<li><a href="/about-us">About</a></li>
										<li><a href="/services">Our Service</a></li>
										<li><a href="/about-us">Company</a></li>
										<li><a href="/">News & Media</a></li>
									</ul>
								</aside>
							</div>
							<div class="pbmit-footer-widget-col-4 col-md-2">
								<aside class="widget widget_text">
									<h2 class="widget-title">Our Services</h2>
									<ul class="menu">
										<li><a href="/services">Logistics</a></li>
										<li><a href="/services">Manufacturing</a></li>
										<li><a href="/services">Production</a></li>
										<li><a href="/services">Transportation</a></li>
										<li><a href="/services">Warehouse</a></li>
										<li><a href="/services">Distribution</a></li>
									</ul>
								</aside>
							</div>
						</div>
					</div>
				</div>
				<div class="pbmit-footer-text-area">
					<div class="container">
						<div class="pbmit-footer-text-inner">
							<div class="row">
								<div class="col-md-12">
									<div class="pbmit-footer-copyright-text-area">
										Copyright © 2026 <a href="#">Titan X Logistics</a>, All Rights Reserved.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
        </footer>
		<!-- footer End -->

   	</div>
   	<!-- Page Wrapper End -->

	<!-- Search Box Start Here -->
	<div class="pbmit-search-overlay">
		<div class="pbmit-icon-close">
			<svg class="qodef-svg--close qodef-m" xmlns="http://www.w3.org/2000/svg" width="28.163" height="28.163" viewBox="0 0 26.163 26.163">
				<rect width="36" height="1" transform="translate(0.707) rotate(45)"></rect>
				<rect width="36" height="1" transform="translate(0 25.456) rotate(-45)"></rect>
			</svg>
		</div>
		<div class="pbmit-search-outer">
			<form class="pbmit-site-searchform">
				<input type="search" class="form-control field searchform-s" name="s" placeholder="Search …">
				<button type="submit"></button>
			</form>
		</div>
	</div>
	<!-- Search Box End Here -->

	<!-- Scroll To Top -->
	<div class="pbmit-backtotop">
		<div class="pbmit-arrow">
			<i class="pbmit-base-icon-plane"></i>
		</div>
		<div class="pbmit-hover-arrow">
			<i class="pbmit-base-icon-plane"></i>
		</div>
	</div>
	<!-- Scroll To Top End -->

   	` }} 
      />
    </>
  );
}
