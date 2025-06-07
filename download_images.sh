#!/bin/bash

# Créer les dossiers nécessaires
mkdir -p images/products

# Télécharger le logo
curl -o images/logo.png "https://cdn-icons-png.flaticon.com/512/2387/2387633.png"

# Télécharger l'image d'arrière-plan
curl -o images/hero-bg.jpg "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&h=1080&fit=crop"

# Télécharger les images de produits
curl -o images/products/manioc.jpg "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop"
curl -o images/products/bananes.jpg "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop"
curl -o images/products/mais.jpg "https://images.unsplash.com/photo-1601473537841-c6cc0dab43b9?w=300&h=200&fit=crop"

echo "Téléchargement des images terminé !" 