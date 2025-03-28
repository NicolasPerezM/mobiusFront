"use client";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
} from "lucide-react";
import CommentsStats from "./CommentsStats";
import useFetchData from "../../../hooks/useFetch";
import Loader from "../../Loader";

/**
 * PostCard – Renderiza la información de un post (usando datos de top_posts del JSON).
 * Gestiona internamente la pestaña activa ("analysis" o "comments") para mostrar
 * detalles adicionales y estadísticas del post.
 */
export default function PostCard({ post }) {
  // Se llaman todos los hooks incondicionalmente
  const { data: commentsData, loading: commentsLoading, error: commentsError } = useFetchData("/data/Processed_Comments_data_infinitekparis_col.json");
  const [activeTab, setActiveTab] = useState("analysis");

  // Manejo de estados de carga y error, pero dentro del render (no retornando antes de llamar a hooks)
  if (commentsLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size="lg" color="primary" />
      </div>
    );
  }

  if (commentsError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Error al cargar los comentarios</p>
      </div>
    );
  }

  if (!commentsData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>No se encontraron comentarios</p>
      </div>
    );
  }

  // Filtramos el objeto de comentarios que corresponde a este post (usando post.id y la propiedad postId)
  const postCommentsData = commentsData.filter(item => item.postId === post.id);
  // Asumimos que cada post tiene un único objeto de comentarios; de ser así, usamos el primero
  const postComments = postCommentsData.length > 0 ? postCommentsData[0].comments : [];

  // Convertimos el timestamp a un objeto Date para obtener fecha y hora
  const postDateObj = new Date(post.timestamp);
  const postDate = postDateObj.toLocaleDateString();
  const postTime = postDateObj.toLocaleTimeString();

  // Extraemos hashtags del caption mediante regex (si existen)
  const hashtags = post.caption.match(/#[\w]+/g) || [];

  // Calculamos el número de shares (asegurando que no sea negativo)
  const computedShares = Math.max(0, post.total_interactions - (post.likesCount + post.commentsCount));

  return (
    <div className="bg-theme-light dark:bg-theme-dark rounded-xl shadow-xl border-t-1 border-b-1 border-theme-light dark:border-theme-primary overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Sección de imagen y datos básicos */}
        <div className="md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-theme-light dark:border-theme-primary">
          <div className="aspect-square rounded-lg overflow-hidden mb-4">
            {/* Al no contar con imagen en el JSON, se usa siempre un placeholder */}
            <img
              src="/placeholder.svg"
              alt={`Post ${post.id}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3">
            {/* Se muestra una versión breve del caption */}
            <p className="text-theme-dark dark:text-theme-light">
              {post.caption}
            </p>
            {/* Se muestran los hashtags extraídos, si existen */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <span key={tag} className="text-primary text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center text-sm text-theme-gray">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{postDate}</span>
              <Clock className="h-4 w-4 ml-3 mr-1" />
              <span>{postTime}</span>
            </div>
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center text-rose-500">
                <Heart className="h-5 w-5 mr-1 fill-current" />
                <span>{post.likesCount}</span>
              </div>
              <div className="flex items-center text-blue-500">
                <MessageCircle className="h-5 w-5 mr-1" />
                <span>{post.commentsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de detalles con pestañas */}
        <div className="md:w-2/3 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">Análisis del Post</h3>
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full">
              <TrendingUp className="h-4 w-4 mr-1" />
              {/* Se muestra el engagement como porcentaje */}
              <span className="font-medium">
                {(post.engagement_rate * 100).toFixed(2)}% Engagement
              </span>
            </div>
          </div>
          <div className="flex mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "analysis"
                  ? "text-theme-darkest bg-theme-white shadow-xl dark:bg-theme-darkest rounded-md dark:text-theme-white dark:border-b-2 border-theme-primary"
                  : "text-theme-gray hover:text-theme-primary"
              }`}
              onClick={() => setActiveTab("analysis")}
            >
              Detalles
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "comments"
                  ? "text-theme-darkest bg-theme-white shadow-xl dark:bg-theme-darkest rounded-md dark:text-theme-white dark:border-b-2 border-theme-primary"
                  : "text-theme-gray hover:text-theme-primary"
              }`}
              onClick={() => setActiveTab("comments")}
            >
              Análisis de comentarios
            </button>
          </div>
          {activeTab === "analysis" ? (
            <div className="animate-fadeIn flex gap-4 flex-col">
              {/* Contenido de la pestaña Detalles */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-theme-white hover:bg-theme-analogous transition delay-30 dark:bg-theme-darkest shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light dark:hover:text-theme-darkest">
                  <div className="text-sm mb-1 font-medium">Total Likes</div>
                  <div className="text-xl font-bold">{post.likesCount}</div>
                </div>
                <div className="bg-theme-white dark:bg-theme-darkest hover:bg-theme-complementary shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light dark:hover:text-theme-darkest">
                  <div className="text-sm mb-1 font-medium">Total Comentarios</div>
                  <div className="text-2xl font-bold">{post.commentsCount}</div>
                </div>
                <div className="bg-theme-white dark:bg-theme-darkest hover:bg-theme-split shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light dark:hover:text-theme-darkest">
                  <div className="text-sm mb-1 font-medium">Tiempo de Respuesta</div>
                  <div className="text-2xl font-bold">{post.commentsCount}</div>
                </div>
              </div>
              <div className="shadow-xl rounded-xl bg-theme-white dark:bg-theme-darkest dark:text-theme-light p-4">
                <h3 className="text-xl font-medium">Insights</h3>
                <p>{post.caption}</p>
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {/* Renderizamos las estadísticas de comentarios usando CommentsStats */}
              <CommentsStats comments={postComments} />
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-1 text-rose-500" />
                  <span className="text-sm">{post.likesCount} Likes</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-1 text-blue-500" />
                  <span className="text-sm">{post.commentsCount} Comentarios</span>
                </div>
                <div className="flex items-center">
                  <Share2 className="h-5 w-5 mr-1 text-green-500" />
                  <span className="text-sm">{computedShares} Shares</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  Engagement: <strong>{(post.engagement_rate * 100).toFixed(2)}%</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
