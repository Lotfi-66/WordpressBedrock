<!DOCTYPE html>
<html {!! get_language_attributes() !!}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {!! wp_head() !!}
    <title>@yield('title', 'Sticker Effect')</title>
    <link rel="icon" type="image/png" href="{{ asset('images/BENOW.png') }}">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  </head>

  <body @php(body_class())>
    @php(wp_body_open())

    @include('sections.header')

    <div id="app">
      @yield('content')
    </div>

    @include('sections.footer')

    {!! wp_footer() !!}
  </body>
</html>