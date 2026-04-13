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
									<h1 class="pbmit-tbar-title"> Services</h1>
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
									<span><span class="post-root post post-post current-item"> Services</span></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Title Bar End-->
		</header>
		<!-- Header Main Area End Here -->

		<div class="page-content">

			<!-- Services Start -->
			<section class="section-lg">
				<div class="container">
					<div class="pbmit-element-posts-wrapper row">
						<article class="pbmit-service-style-1 col-md-4">
							<div class="pbminfotech-post-item">
								<div class="pbmit-box-content-wrap">
									<div class="pbmit-service-image-wrapper">
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/service/service-img-01.jpg" class="img-fluid" alt="">
											</div>
										</div>
										<div class="pbmit-service-btn-wrapper">
											<a class="pbmit-service-btn" href="/services" title="Warehouse Storage">
												<span class="pbmit-button-icon">
													<i class="pbmit-base-icon-angle-right"></i>
												</span>
											</a>
										</div>
									</div>
									<div class="pbmit-content-box">
										<div class="pbminfotech-box-number">01</div>
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title"><a href="/services">Logistics</a></h3>
										<div class="pbmit-service-description">
											<p>Efficient logistics solutions designed to streamline supply chains and ensure timely global deliveries.</p>
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-service-style-1 col-md-4">
							<div class="pbminfotech-post-item">
								<div class="pbmit-box-content-wrap">
									<div class="pbmit-service-image-wrapper">
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/service/service-img-02.jpg" class="img-fluid" alt="">
											</div>
										</div>
										<div class="pbmit-service-btn-wrapper">
											<a class="pbmit-service-btn" href="/services" title="Warehouse Storage">
												<span class="pbmit-button-icon">
													<i class="pbmit-base-icon-angle-right"></i>
												</span>
											</a>
										</div>
									</div>
									<div class="pbmit-content-box">
										<div class="pbminfotech-box-number">01</div>
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title"><a href="/services">Manufacturing</a></h3>
										<div class="pbmit-service-description">
											<p>Supporting manufacturing operations with reliable coordination, material flow, and optimized production support.</p>
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-service-style-1 col-md-4">
							<div class="pbminfotech-post-item">
								<div class="pbmit-box-content-wrap">
									<div class="pbmit-service-image-wrapper">
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/service/service-img-03.jpg" class="img-fluid" alt="">
											</div>
										</div>
										<div class="pbmit-service-btn-wrapper">
											<a class="pbmit-service-btn" href="/services" title="Warehouse Storage">
												<span class="pbmit-button-icon">
													<i class="pbmit-base-icon-angle-right"></i>
												</span>
											</a>
										</div>
									</div>
									<div class="pbmit-content-box">
										<div class="pbminfotech-box-number">01</div>
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title"><a href="/services">Production</a></h3>
										<div class="pbmit-service-description">
											<p>Enhancing production efficiency through smart planning, resource management, and operational precision.</p>
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-service-style-1 col-md-4">
							<div class="pbminfotech-post-item">
								<div class="pbmit-box-content-wrap">
									<div class="pbmit-service-image-wrapper">
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/service/service-img-04.jpg" class="img-fluid" alt="">
											</div>
										</div>
										<div class="pbmit-service-btn-wrapper">
											<a class="pbmit-service-btn" href="/services" title="Warehouse Storage">
												<span class="pbmit-button-icon">
													<i class="pbmit-base-icon-angle-right"></i>
												</span>
											</a>
										</div>
									</div>
									<div class="pbmit-content-box">
										<div class="pbminfotech-box-number">01</div>
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title"><a href="/services">Transportation</a></h3>
										<div class="pbmit-service-description">
											<p>Fast and secure transportation services ensuring goods move smoothly across local and international routes.</p>
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-service-style-1 col-md-4">
							<div class="pbminfotech-post-item">
								<div class="pbmit-box-content-wrap">
									<div class="pbmit-service-image-wrapper">
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/service/service-img-05.jpg" class="img-fluid" alt="">
											</div>
										</div>
										<div class="pbmit-service-btn-wrapper">
											<a class="pbmit-service-btn" href="/services" title="Warehouse Storage">
												<span class="pbmit-button-icon">
													<i class="pbmit-base-icon-angle-right"></i>
												</span>
											</a>
										</div>
									</div>
									<div class="pbmit-content-box">
										<div class="pbminfotech-box-number">01</div>
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title"><a href="/services">Warehouse</a></h3>
										<div class="pbmit-service-description">
											<p>Modern warehouse management solutions for safe storage, inventory control, and quick distribution access.</p>
										</div>
									</div>
								</div>
							</div>
						</article>
						<article class="pbmit-service-style-1 col-md-4">
							<div class="pbminfotech-post-item">
								<div class="pbmit-box-content-wrap">
									<div class="pbmit-service-image-wrapper">
										<div class="pbmit-featured-img-wrapper">
											<div class="pbmit-featured-wrapper">
												<img src="images/service/service-img-06.jpg" class="img-fluid" alt="">
											</div>
										</div>
										<div class="pbmit-service-btn-wrapper">
											<a class="pbmit-service-btn" href="/services" title="Warehouse Storage">
												<span class="pbmit-button-icon">
													<i class="pbmit-base-icon-angle-right"></i>
												</span>
											</a>
										</div>
									</div>
									<div class="pbmit-content-box">
										<div class="pbminfotech-box-number">01</div>
										<div class="pbmit-serv-cat"></div>
										<h3 class="pbmit-service-title"><a href="/services">Distribution</a></h3>
										<div class="pbmit-service-description">
											<p>Scalable distribution networks designed to deliver products efficiently from warehouses to final destinations.</p>
										</div>
									</div>
								</div>
							</div>
						</article>
					</div>
				</div>
			</section>
			<!-- Services end -->

		</div>

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
