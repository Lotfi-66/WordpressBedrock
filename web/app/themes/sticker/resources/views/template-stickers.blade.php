@extends('layouts.app')

@section('content')
    @include('partials.page-header')

    <div id="app" class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            @php
                $stickers = get_posts([
                    'post_type' => 'sticker',
                    'posts_per_page' => -1,
                ]);
            @endphp

            @if ($stickers)
                @foreach ($stickers as $sticker)
                    <div class="sticker-item logo-item aspect-square relative cursor-pointer transition-transform hover:scale-105" data-sticker-id="{{ $sticker->ID }}">
                        <div class="logo-name absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-center uppercase font-medium text-lg sm:text-xl md:text-2xl">
                            {{ $sticker->post_title }}
                        </div>
                        <img src="{{ get_field('image_du_sticker', $sticker->ID)['url'] }}" alt="{{ $sticker->post_title }}" class="w-full h-full object-contain rounded-lg shadow-lg opacity-0 transition-opacity">
                    </div>
                @endforeach
            @else
                <p class="col-span-full text-center">Aucun sticker trouvé.</p>
            @endif
        </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-black p-4 shadow-lg">
        <form id="unlock-form" class="flex justify-center items-center">
            <input type="text" id="unlock-code" placeholder="Entrez le code de déverrouillage" class="border rounded px-3 py-2 mr-2">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Déverrouiller</button>
        </form>
    </div>
@endsection

@push('scripts')
<script src="{{ asset('js/stickers.js') }}" type="module"></script>
@endpush